// redisMiddleware.js
const redisClient = require("../utils/redis");

function attachRedisClient(req, res, next) {
  req.redisClient = redisClient;
  next();
}

module.exports = attachRedisClient;