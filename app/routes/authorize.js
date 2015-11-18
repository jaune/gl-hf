var express = require('express');
var passport = require('passport');
var authorize = express();
var uuid = require('node-uuid');

var authorizations = require('../storages/authorization.js');
var models = require('../models');

module.exports = authorize;

var SteamStrategy = require('passport-steam').Strategy;
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8080/authorize/steam/callback',
    realm: 'http://localhost:8080/',
    apiKey: 'EBC459AFF5ACCD95BA1BB357B2B16750'
  },
  function(identifier, profile, next) {
    process.nextTick(function () {
      next(null, profile);
    });
  })
);

var TwitchtvStrategy = require('passport-twitchtv').Strategy;
passport.use(new TwitchtvStrategy({
    clientID: 'hbgxweyzlh5jdoyf8dx1pmj8494o5eo',
    clientSecret: 'f71e4c2uxma14cd4h2emhs2e3u6obr3',
    callbackURL: 'http://localhost:8080/authorize/twitch/callback',
    scope: 'user_read'
  },
  function(accessToken, refreshToken, profile, next) {
    process.nextTick(function () {
      return next(null, profile);
    });
  }
));

var BnetStrategy = require('passport-bnet').Strategy;
passport.use(new BnetStrategy({
    clientID: 'n2gpuk596s87bymthsdrxtnmqp6nx54s',
    clientSecret: 'WqTu3G5Qbfsa6JByzvDeQwdTtrfZDEM9',
    callbackURL: "https://localhost:3000/authorize/bnet/callback"
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return next(null, profile);
    });
}));

authorize.get('/', function (req, res) {
  var props = {};

  res.renderEntry('authorize', props);
});

function authorizeCallback(req, res, next) {
  var authorization_uuid = uuid.v4();
  var data = {
    uuid: authorization_uuid,
    sid: req.session.id,
    authorization: req.account
  };

  var Model;

  switch (req.account.provider) {
    case 'steam':
      Model = models.AuthorizationStream;
    break;
    case 'twitchtv':
      Model = models.AuthorizationTwitch;
    break;
  }

  if (!Model) {
    return res.sendStatus(500); // 500 Internal Error
  }

  authorizations.set(authorization_uuid, data, function (error) {
    if (error) { return next(error); }

    Model.find({
      where: { provider_id: data.authorization.id },
      include: [ models.Account ]
    }).then(function(authorizationModel) {
      if (req.session.user) {
        if (authorizationModel) {
          if (authorizationModel.AccountId === req.session.user.account_id) {
            // authorization already attach to this account
            return res.redirect('/authorize/'+authorization_uuid+'/message/already-attach-to-this-account');
          } else {
            // authorization attach to an other account
            return res.redirect('/authorize/'+authorization_uuid+'/message/attach-to-an-other-account');
          }
        } else {
          // attach authorization to account
          return res.redirect('/authorize/'+authorization_uuid+'/form/add-authorization');
        }
      } else {
        if (authorizationModel) {
          // set user in session
          req.session.user = {
            account_id: authorizationModel.Account.id,
            account_uuid: authorizationModel.Account.uuid,
          };

          req.session.save(function(error) {
            if (error) {
              authorizations.delete(authorization_uuid); // async
              return next(error);
            }
            res.redirect('/account/'+authorizationModel.Account.uuid);
          });
          return;
        } else {
          // create a account
          return res.redirect('/authorize/'+authorization_uuid+'/form/create-account');
        }
      }
    });
  });
}

authorize.get('/steam', passport.authorize('steam'));
authorize.get('/steam/callback', passport.authorize('steam'), authorizeCallback);
authorize.get('/twitch', passport.authorize('twitchtv'));
authorize.get('/twitch/callback', passport.authorize('twitchtv'), authorizeCallback);

function buildPublicAuthorization(uuid, privateAuth) {
  var publicAuth = {
    uuid: uuid
  };

  ['provider', 'displayName'].forEach(function (key) {
    publicAuth[key] = privateAuth[key]
  });

  return publicAuth;
}

function buildPublicUser(privateUser) {
  var account_id = null;

  if (privateUser && privateUser.account_id) {
    account_id = privateUser.account_id;
  } 

  return {
    account_id: account_id
  };
}


function mwAuthorizationFromParam(req, res, next){
  authorizations.get(req.params.authorize_uuid, function (error, value) {
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



var setLocaleAction = require('../../app/actions/setLocale');
var setLocationAction = require('../../app/actions/setLocation');


/**
 *
 *
 */
authorize.get('/:authorize_uuid/form/add-authorization', mwAuthorizationFromParam, function (req, res, next) {
  var entry = res.createEntry('app', {
    req: req
  });

  entry.context.getActionContext().executeAction(setLocaleAction, {
    language: 'en',
    region: 'US'
  }, function (error) {
    if (error) { return next(error); }

    entry.context.getActionContext().executeAction(setLocationAction, {
      route: authorize.mountpath + req.route.path,
      params: req.params
    }, function (error) {
      if (error) { return next(error); }

      res.sendEntry(entry);
    });
  });
});

/**
 *
 *
 */
authorize.get('/:authorize_uuid/form/create-account', function (req, res, next) {
  var entry = res.createEntry('app', {
    req: req
  });

  entry.context.getActionContext().executeAction(setLocaleAction, {
    language: 'en',
    region: 'US'
  }, function (error) {
    if (error) { return next(error); }

    entry.context.getActionContext().executeAction(setLocationAction, {
      pattern: authorize.mountpath + req.route.path,
      params: req.params
    }, function (error) {
      if (error) { return next(error); }

      res.sendEntry(entry);
    });
  });
});

/**
 *
 *
 */
authorize.get('/:authorize_uuid/message/:message_key', mwAuthorizationFromParam, function (req, res, next) {
  var props = {
    messageKey: req.params.message_key,
    authorization: buildPublicAuthorization(req.authorization.uuid, req.authorization.authorization)
  };    

  return res.renderEntry('authorize/message', props);
});
