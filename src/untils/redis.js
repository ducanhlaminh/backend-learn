const { createClient } = require("redis");

const redis = createClient().on("connect", () =>
    console.log("REDIS-CLI CONNECTED !!!")
);
redis.connect();
module.exports = redis;
