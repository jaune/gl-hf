var path_ = require('path');

function _pathToResource(path) {
  var resourcePath = path_.join(__dirname, '../../app/resources');
  var part;

  if (!Array.isArray(path)) {
    throw new Error('Path must be an Array. Given ' + (typeof path));
  }

  path = path.slice(0);

  while (path.length > 0) {
    part = path.shift()
   
    if (part.charAt && part.charAt(0) === '/') {
      if (part.length > 1) {
        resourcePath = path_.join(resourcePath, part.substr(1));
      } else {
        if (path.length === 0) {
          return require(path_.join(resourcePath, 'collection.js'));
        } else {
          throw new Error('Invalid path. `/` in middle.');
        }
      }
    }
  }
  return require(path_.join(resourcePath, 'resource.js'));
}

module.exports = function (pluginOptions) {
	return {
    name: 'ResourcePlugin',
    plugContext: function (contextOptions) {
      return {
        plugActionContext: function (actionContext, context, app) {
          actionContext.resource = {
            get: function (path, payload, next) {
              var resource = _pathToResource(path);

              if (arguments.length == 2){
                resource.get.call(contextOptions, {}, payload, next);
              } else {
                resource.get.call(contextOptions, payload, next);
              }
            }
          }
        },
        dehydrate: function dehydrate() {
          return {};
        },
        rehydrate: function rehydrate(state) {
        }
      };
    }
  }
};