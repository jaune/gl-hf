var createStore = require('fluxible/addons/createStore');

module.exports = createStore({
  storeName: 'AuthorizationStore',
  handlers: {
    'LOAD_AUTHORIZATION_START': function (payload) {
    },
    'LOAD_AUTHORIZATION_FAILURE': function (payload) {
    },
    'LOAD_AUTHORIZATION_SUCCESS': function (payload) {
      this.uuid = payload.uuid;
      this.authorization = payload.authorization;

      this.emitChange();
    }
  },

  initialize: function () {
    this.uuid = null;
    this.authorization = null;
  },

  getUUID: function () {
    return this.uuid;
  },

  getAuthorization: function () {
    return this.authorization;
  },

  dehydrate: function () {
    var state = {};

    ['uuid', 'authorization'].forEach(function (k) {
      state[k] = this[k];
    }, this);
    
    return state;
  },

  rehydrate: function (state) {
    ['uuid', 'authorization'].forEach(function (k) {
      this[k] = state[k];
    }, this);
  }
});