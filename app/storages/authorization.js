var redis = require('../../redis.js');

module.exports = {
  delete: function (uuid, cb) {
    var key = 'authorization/' + uuid;

    redis.del(key).then(function () {
      cb();
    });
  },
  get: function (uuid, cb) {
    var key = 'authorization/' + uuid;

    redis.get(key, cb);
  },
  set: function(uuid, data, cb) {
    var key = 'authorization/' + uuid;

    redis.set(key, JSON.stringify(data), 'EX', 60 * 60).then(function () {
      cb(null);
    });
  }
};