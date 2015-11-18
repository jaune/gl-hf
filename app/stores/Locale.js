var createStore = require('fluxible/addons/createStore');

var MESSAGES = {};

MESSAGES['fr-FR'] = require('../locales/fr-FR.js');
MESSAGES['en-US'] = require('../locales/en-US.js');


module.exports = createStore({
  storeName: 'LocaleStore',
  handlers: {
    'SET_LOCALE': function (payload) {
      this.language = payload.language;
      this.region = payload.region;

      console.log('---*---');
      
      this.emitChange();
    }
  },

  initialize: function () {
    this.language = 'fr';
    this.region = 'FR';
  },
 
  getRegion: function () {
    return this.region;
  },
  getLanguage: function () {
    return this.language;
  },
  getLocale: function () {
    return this.getLanguage() + '-' + this.getRegion();
  },
  getMessages: function () {
    return MESSAGES[this.getLocale()];
  },

  dehydrate: function () {
    var state = {};

    ['language', 'region'].forEach(function (k) {
      state[k] = this[k];
    }, this);
    
    return state;
  },

  rehydrate: function (state) {
    ['language', 'region'].forEach(function (k) {
      this[k] = state[k];
    }, this);
  }
});