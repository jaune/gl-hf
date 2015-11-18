var createStore = require('fluxible/addons/createStore');

module.exports = createStore({
  storeName: 'RouteStore',
  handlers: {
    'NAVIGATE_START': function (payload) {
      this.currentRoutePattern = payload.pattern;
    
      this.emitChange();
    },
    'NAVIGATE_FAILURE': function (payload) {
    },
    'NAVIGATE_SUCCESS': function (payload) {
    }
  },

  _patternToComponent: function (pattern) {
      switch (pattern) {
        case '/':
          return require('../components/content/Home.jsx');
        case '/authorize/:authorize_uuid/form/create-account':
          return require('../components/authorize/CreateAccountFormEntry.jsx');
        case '/authorize/:authorize_uuid/form/add-authorization':
          return require('../components/authorize/AddAuthorizationFormEntry.jsx');
        default:
          return null;
      }
  },

  _patternToAction: function (pattern) {
      switch (pattern) {
        case '/authorize/:authorize_uuid/form/create-account':
        case '/authorize/:authorize_uuid/form/add-authorization':
          return require('../actions/authorize/loadAuthorization');
        default:
          return null;
      }
  },

  initialize: function () {
    this.currentRoutePattern = null;
  },
  
  getCurrentRouteComponent: function () {
    return this._patternToComponent(this.currentRoutePattern);
  },

  getCurrentRouteAction: function () {
    return this._patternToAction(this.currentRoutePattern);
  },

  dehydrate: function () {
    var state = {};

    ['currentRoutePattern'].forEach(function (k) {
      state[k] = this[k];
    }, this);
    
    return state;
  },

  rehydrate: function (state) {
    ['currentRoutePattern'].forEach(function (k) {
      this[k] = state[k];
    }, this);
  }
});