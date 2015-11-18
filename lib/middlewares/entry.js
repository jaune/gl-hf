require('node-jsx').install({extension: '.jsx'});
global.Intl = require('intl');

var path_ = require('path');
var React = require('react');
var ReactDOM = require('react-dom/server');
var ReactFluxible = require('fluxible-addons-react');
var serialize = require('serialize-javascript');

const HtmlComponent = require('../../app/components/Html.jsx');

function renderEntryContext(res, e) {
  const state = 'window.EntryState = ' + serialize(e.entry.dehydrate(e.context)) + ';';
  const entry = ReactDOM.renderToString(ReactFluxible.createElementWithContext(e.context));
  const htmlElement = React.createElement(HtmlComponent, {
      context: e.context.getComponentContext(),
      state: state,
      entry: entry,
      commonPath: '/webpack_bundles/_common.js',
      entryPath: '/webpack_bundles/'+e.path
  });
  const html = ReactDOM.renderToStaticMarkup(htmlElement);

  res.type('html');
  res.write('<!DOCTYPE html>' + html);
  res.end();
}

function createEntry(entryRelativePath, contextOptions) {
  entryRelativePath = entryRelativePath + '.js';

  var entryPath = path_.join(process.cwd(), 'app/entries', entryRelativePath);

  var entry = require(entryPath);
  var resourcePlugin = require('../plugins/resource.js');

  entry.plug(resourcePlugin({}));

  var context = entry.createContext(contextOptions);

  return {
    path: entryRelativePath,
    entry: entry,
    context: context
  };
}

function renderEntry(res, entryRelativePath) {
  var e = createEntry(entryRelativePath);

  e.context.getActionContext().executeAction(setLocaleAction, {
    language: 'en',
    region: 'US'
  }, function (error) {
    if (error) {
      console.error(error);
      res.send('Error !!!!');
      return;
    }

    renderEntryContext(res, e);
  });
};

module.exports = function(app) {
  return function (req, res, next) {

    res.createEntry = function (entryRelativePath, contextOptions) {
      return createEntry(entryRelativePath, contextOptions);
    };

    res.sendEntry = function (entry) {
      renderEntryContext(res, entry);
  	};

    next();
  };

};