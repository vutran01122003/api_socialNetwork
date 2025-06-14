const redis = require("redis");
const { REDIS_HOST, REDIS_PORT, REDIS_CLOUD_URI } = process.env;
const client = REDIS_CLOUD_URI
    ? redis.createClient({
          url: REDIS_CLOUD_URI
      })
    : redis.createClient({
          legacyMode: true,
          socket: {
              port: REDIS_PORT || 63779,
              host: REDIS_HOST || "127.0.0.1"
          }
      });

client
    .connect()
    .then(() => {
        console.log("REDIS connected");
    })
    .catch((e) => {
        console.log("REDIS error: ", JSON.stringify(e));
    });

module.exports = client;
