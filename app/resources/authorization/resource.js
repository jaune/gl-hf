var authorizations = require('../../storages/authorization.js');

function makePublic(privateData) {
  var publicData = {};

  ['provider', 'displayName'].forEach(function (k) {
    publicData[k] = privateData[k];
  }, this);

  return publicData;
}

module.exports = {
  get: function (payload, done) {
    var me = this,
        authorize_uuid = me.req.params.authorize_uuid;

    authorizations.get(authorize_uuid, function (error, value) {
      if (error) {
        done(error);
        return;
      }

      var data = null;

      try {
        data = JSON.parse(value);
      } catch (e) {}

      if (data === null) {
        error = new Error('Not Found');
        error.status = 404
        return done(error);
      }

      if (data.sid !== me.req.session.id) {
        error = new Error('Forbidden');
        error.status = 403
        return done(error);
      }

      done(null, {
        uuid: data.uuid,
        authorization: makePublic(data.authorization)
      });
    });
  }
};