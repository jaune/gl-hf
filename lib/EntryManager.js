require('node-jsx').install({extension: '.jsx'});
global.Intl = require('intl');

var path_ = require('path');
var React = require('react');
var ReactIntl = require('react-intl');
var IntlProvider = ReactIntl.IntlProvider;
var addLocaleData = ReactIntl.addLocaleData;
var ReactDOMServer = require('react-dom/server');

function EntryManager (path) {
  this.entriesPath = path;
  this.entities = {};
}

module.exports = EntryManager;

EntryManager.prototype.middleware = function(entryRelativePath) {
  var entryPath = path_.join(this.entriesPath, entryRelativePath);

  this.entities[entryPath] = {
    path: entryPath,
    relativePath: entryRelativePath
  };

  return function (req, res, next) {
    
    res.renderEntry = function (props) {
      var entry = require(entryPath);
      var factory = entry.createFactory();

      var data = {
        title: 'The Title',
        language: 'fr',
        region: 'FR',
        messages: {},
        props: props 
      };

      var locale = data.language + ((data.region) ? ('-' + data.region) : '');

      data.messages[locale] = require(path_.join(__dirname, '..', 'locales', locale + '.js'));
      
      var root = React.createElement(IntlProvider, {
        locale: locale,
        messages: data.messages[locale]
      }, factory(props));

      return res.render('layout', {
        lang: data.language,
        title: data.title,
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



EntryManager.prototype.watch = function(callback) {
  var me = this;
  var webpack = require("webpack");

  var entry = {};

  Object.keys(this.entities).forEach(function (absolutePath) {
    var relativePath = me.entities[absolutePath].relativePath;

    var filename = path_.basename(relativePath, path_.extname(relativePath));
    var name = path_.join(path_.dirname(relativePath), filename);

    var loaderPath = require.resolve('../loaders/boot-entry.js');

    entry[name] = loaderPath + '!' + absolutePath;
  });

	var compiler = webpack({
	    entry: entry,
	//    devtool: 'source-map',
	    output: {
	      path: 'public/webpack_bundles',
	      filename: '[name].js',
	      publicPath: '/'
	    },
	    module: {
	      loaders: [
	        {
	          test: /\.jsx$/, // A regexp to test the require path. accepts either js or jsx
	          loader: 'babel', // The module to load. "babel" is short for "babel-loader"
	          exclude: /node_modules/
	        }
	      ],
	      noParse: [__dirname + '/../node_modules/react/dist/react.js']
	    },
	    resolve: {
	      alias: {
	        'react': __dirname + '/../node_modules/react/dist/react.js',
	        'react-dom': __dirname + '/../node_modules/react-dom/dist/react-dom.js',
	      },
	      extensions: ['', '.js']
	    },
	    externals: {
	    },
	    plugins: [
	      new webpack.optimize.CommonsChunkPlugin('_common', '_common.js')
	    ]
	});

	compiler.watch({}, function(error, stats) {
		if (error) {
			callback(error);
			return;
		}

	  stats.compilation.modules.forEach(function(module) {
	    if (module.built) {
	      var matches = module.request.match(/([^!]*)$/);
	      if (matches) {
	        var path = matches[1];

          if (require.cache.hasOwnProperty(path)) { // TODO
            delete require.cache[path];
          }
	      }
	    }
	  });

	  callback(null, stats);

	});
};