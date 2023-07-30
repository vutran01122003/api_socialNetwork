const redis = require('redis');

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

client
    .connect()
    .then(() => {
        console.log('REDIS::: connected');
    })
    .catch((e) => {
        console.log('REDIS::: ', JSON.stringify(e));
    });

module.exports = client;
