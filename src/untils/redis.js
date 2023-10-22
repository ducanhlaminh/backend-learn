const { createClient } = require("redis");

const client = createClient().on("connect", () =>
    console.log("REDIS-CLI CONNECTED !!!")
);
client.connect();
module.exports = client;
