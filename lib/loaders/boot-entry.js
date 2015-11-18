var loaderUtils = require('loader-utils');
var url_ = require('url'),
    path_ = require('path');

module.exports = function (content) {
  if(this.cacheable) this.cacheable();

  var done = this.async();
  var me = this;
  var moduletPath = loaderUtils.getRemainingRequest(this);

  return done(null, [
    'var boot = require(' + loaderUtils.stringifyRequest(me, require.resolve('./_boot.js') ) + ')',
    'var entry = require('+loaderUtils.stringifyRequest(me, moduletPath)+');',
    'boot(entry)',
    '',
    'module.exports = {};'
  ].join('\n'));
};