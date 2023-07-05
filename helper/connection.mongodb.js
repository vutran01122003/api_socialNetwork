const mongoose = require('mongoose');

function connectMongodb(uri, options) {
    const db = mongoose.createConnection(uri, options);

    db.on('connected', function () {
        console.log('MongoDB::: connected', this.name);
    });

    db.on('error', (err) => {
        console.log(`MongoDB::: error::: ${JSON.stringify(err)}`);
    });

    db.on('disconnected', () => {
        console.log('MongoDB::: disconnected');
    });

    return db;
}

module.exports = connectMongodb;
