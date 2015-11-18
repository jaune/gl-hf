var express = require('express');
var account = express();

module.exports = account;

var authorizations = require('../storages/authorization.js');
var models = require('../models');


function mwAuthorizationFromBody(req, res, next){
  
  if (!req.body.hasOwnProperty('authorization.uuid')) {
    return res.sendStatus(400); // 400 Bad Request
  }

  authorizations.get(req.body['authorization.uuid'], function (error, value) {
    if (error) {
      next(error);
      return;
    }

    var data = null;

    try {
      data = JSON.parse(value);
    } catch (error) {
    }

    if (data === null) {
      return res.sendStatus(404); // 404 Not Found
    }

    if (data.sid !== req.session.id) {
      return res.sendStatus(403); // 403 Forbidden
    }

    req.authorization = data;

    return next();
  });
}

function mwCheckNotUser(req, res, next) {
  if (req.session.user) {
    return res.sendStatus(403); // 403 Forbidden
  }
  return next();
}

/**
 *
 *
 */
account.post('/', mwCheckNotUser, mwAuthorizationFromBody, function(req, res, next) {
  var createAuthorization;
  var AuthorizationModel;
  var accountModel;
  var authorizationModel;

  var data = req.authorization;
  var providerKey = data.authorization.provider;

  switch (providerKey) {
    case 'steam': 
      createAuthorization = function () {
        return accountModel.createAuthorizationStream({
          provider_id: data.authorization.id
        });
      };
      AuthorizationModel = models.AuthorizationStream;
      break;
    case 'twitchtv':
      createAuthorization = function () {
        return accountModel.createAuthorizationTwitch({
          username: data.authorization.username,
          provider_id: data.authorization.id
        });
      };
      AuthorizationModel = models.AuthorizationTwitch;
      break;
  }

  if (!createAuthorization || !AuthorizationModel) {
    return res.sendStatus(500); // 500 Internal Error
  }

  AuthorizationModel.find({
    where: { provider_id: data.authorization.id }
  }).then(function (authorizationModel) {
    if (authorizationModel) {
      // authorization attach to an other account
      return res
        .status(403) // 403 Forbidden
        .send(JSON.stringify({
          message: 'authorization.message.attach-to-an-other-account'
        }, null, 2));
    } else {
      models.Account.create({
        displayName: data.authorization.displayName
      }).then(function(account) {
        accountModel = account;
        return createAuthorization();
      }).then(function(authorization) {
        authorizationModel = authorization;
        req.session.user = {
          account_id: accountModel.id,
          account_uuid: accountModel.uuid,
        };
        authorizations.delete(req.authorization.id, function () {
          return res.send(JSON.stringify(authorization, null, 2));
        });        
      });
    }
  });
});

function mwCheckAccountOwedByUser(req, res, next) {
  if (!req.session.user) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  if ((''+req.params.account_uuid) !== (''+req.session.user.account_uuid)) {
    return res.sendStatus(403); // 403 Forbidden
  }

  return next();
}

/**
 *
 *
 */
account.post('/:account_uuid/authorization/', mwCheckAccountOwedByUser, mwAuthorizationFromBody, function(req, res) {
  var data = req.authorization;
  var providerKey = data.authorization.provider;
  var createAuthorization;
  var AuthorizationModel;
  var accountModel;
  
  switch (providerKey) {
    case 'steam': 
      createAuthorization = function () {
        return accountModel.createAuthorizationStream({
          provider_id: data.authorization.id
        });
      };
      AuthorizationModel = models.AuthorizationStream;
      break;
    case 'twitchtv':
      createAuthorization = function () {
        return accountModel.createAuthorizationTwitch({
          username: data.authorization.username,
          provider_id: data.authorization.id
        });
      };
      AuthorizationModel = models.AuthorizationTwitch;
      break;
  }

  if (!createAuthorization) {
    return res.sendStatus(500); // 500 Internal Error
  }

  AuthorizationModel.find({
    where: { provider_id: data.authorization.id }
  }).then(function (authorizationModel) {
    if (authorizationModel) {
      if (authorizationModel.AccountId === req.session.user.account_id) {
        // authorization already attach to this account
        return res
          .status(403) // 403 Forbidden
          .send(JSON.stringify({
            message: 'authorization.message.already-attach-to-this-account'
          }, null, 2));  
      } else {
        // authorization attach to an other account
        return res
          .status(403) // 403 Forbidden
          .send(JSON.stringify({
            message: 'authorization.message.attach-to-an-other-account'
          }, null, 2));  
      }      
    } else {
      models.Account.find({
        where: { uuid: req.params.account_uuid }
      }).then(function(account) {
        if (!account) {
          return res.sendStatus(404); // 404 Not Found
        }
        accountModel = account;
        return createAuthorization();
      }).then(function(authorization) {
        authorizationModel = authorization;
        authorizations.delete(req.authorization.id, function () {
          return res.send(JSON.stringify(authorization, null, 2));
        });
      });    
    }
  });
});

/**
 *
 *
 */
account.get('/:account_uuid/authorization/', function (req, res) {
  models.Account.find({
    where: { id: req.params.account_uuid },
    include: [ models.AuthorizationStream, models.AuthorizationTwitch ]
  }).then(function(account) {
    if (!account) {
      return res.sendStatus(404);
    }
    return res.send({
      account: account
    });
  });
});

/**
 *
 *
 */
function buildPublicAccount(privateAccount) {
  var publicAccount = {};

  var authorizations = [];

  privateAccount.AuthorizationStreams.forEach(function (authorization) {
    authorizations.push({
      provider: 'stream',
      steamid: authorization.provider_id
    });
  });
  
  privateAccount.AuthorizationTwitches.forEach(function (authorization) {
    authorizations.push({
      provider: 'twitchtv',
      username: authorization.username,
      url: 'http://www.twitch.tv/' + authorization.username
    });
  });

  publicAccount.uuid = privateAccount.uuid;
  publicAccount.displayName = privateAccount.displayName;
  publicAccount.authorizations = authorizations;

  // console.log(JSON.stringify(privateAccount, null, 2));

  return publicAccount;
}

/**
 *
 *
 */
account.get('/:account_uuid', function (req, res) {
  models.Account.find({
    where: { uuid: req.params.account_uuid },
    include: [ models.AuthorizationStream, models.AuthorizationTwitch ]
  }).then(function(account) {
    if (!account) {
      return res.sendStatus(404);
    }
    return res.renderEntry('account/show', {
      account: buildPublicAccount(account)
    });
  });
});

/**
 *
 *
 */
account.get('/', function (req, res) {
  models.Account.findAll({
    include: [ models.AuthorizationStream, models.AuthorizationTwitch ]
  }).then(function(accounts) {
    res.json({
      accounts: accounts
    });
  });
});