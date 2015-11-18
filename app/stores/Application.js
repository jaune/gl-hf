var createStore = require('fluxible/addons/createStore');

module.exports = createStore({
  storeName: 'ApplicationStore',
  handlers: {
    'SET_TITLE': function (payload) {
      this.title = payload.title;
      
      this.emitChange();
    }
  },

  initialize: function () {
  },
  
  getTitle: function () {
    return 'The Title';
  },

  dehydrate: function () {
    var state = {};

    [].forEach(function (k) {
      state[k] = this[k];
    }, this);
    
    return state;
  },

  rehydrate: function (state) {
    [].forEach(function (k) {
      this[k] = state[k];
    }, this);
  }
});