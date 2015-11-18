var path = require('path');
var webpack = require('webpack');
var loaderPath = require.resolve('./lib/loaders/boot-entry.js');
var entriesPath = __dirname + '/app/entries';
var entries = require('glob').sync(entriesPath+'/**/*.js', {});
var entry = {};

var ExtractTextPlugin = require('extract-text-webpack-plugin');

entries.forEach(function (absolutePath) {
  if (path.basename(absolutePath) === 'index.js') {
    return;
  }
  var relativePath = path.relative(entriesPath, absolutePath);
  var filename = path.basename(relativePath, path.extname(relativePath));
  var name = path.join(path.dirname(relativePath), filename);

  entry[name] = loaderPath + '!' + absolutePath;
});

module.exports = {
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
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      }
    ],
    noParse: [__dirname + '/node_modules/react/dist/react.js']
  },
  resolve: {
    alias: {
      'react': __dirname + '/node_modules/react/dist/react.js',
      'react-dom': __dirname + '/node_modules/react-dom/dist/react-dom.js'
    }
  },
  externals: {
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('_common', '_common.js'),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  ]
}