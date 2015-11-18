var Redis = require('ioredis');
var redis = new Redis({ showFriendlyErrorStack: true });

redis.on('connect', function () {
  console.log('--- redis connect ---');
});

redis.on('authError', function () {
  console.log('--- redis authError ---');
});

redis.on('error', function () {
  console.log('--- redis error ---');
});

module.exports = redis;