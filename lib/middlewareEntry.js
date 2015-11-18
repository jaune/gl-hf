require('node-jsx').install({extension: '.jsx'});
global.Intl = require('intl');

var path = require('path');
var React = require('react');
var ReactIntl = require('react-intl');
var IntlProvider = ReactIntl.IntlProvider;
var addLocaleData = ReactIntl.addLocaleData;
var ReactDOMServer = require('react-dom/server');

module.exports = function(app) {
  var entriesPath = app.get('entities');

  entriesPath = entriesPath || path.join(process.cwd(), 'entries');

  return function (req, res, next) {
    
    res.renderEntry = function (entryRelativePath, props) {
      entryRelativePath = entryRelativePath + '.js';

      var entryPath = path.join(entriesPath, entryRelativePath);

      var entry = require(entryPath);
      var factory = entry.createFactory();

      var contexts = {
        page: {
          title: 'The Title',  
        },
        i18n: {
          language: 'fr',
          region: 'FR',
          messages: {}
        }
      }

      var data = {
        contexts: contexts,
        props: props
      };

      var locale = contexts.i18n.language + ((contexts.i18n.region) ? ('-' + contexts.i18n.region) : '');

      contexts.i18n.messages[locale] = require(path.join(__dirname, '..', 'locales', locale + '.js'));
      
      var root = React.createElement(IntlProvider, {
        locale: locale,
        messages: contexts.i18n.messages[locale]
      }, factory(props));

      return res.render('layout', {
        lang: contexts.i18n.language,
        title: contexts.page.title,
        scripts: [
          { src : '/webpack_bundles/_common.js' },
          { src : '/webpack_bundles/'+entryRelativePath, async: true }
        ],
        main: ReactDOMServer.renderToString(root),
        data: JSON.stringify(data)
      });
    };

    next();
  };
};