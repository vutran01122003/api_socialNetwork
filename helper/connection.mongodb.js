const mongoose = require("mongoose");

function connectMongodb(uri, options) {
    const db = mongoose.createConnection(uri, options);
    return db;
}

module.exports = connectMongodb;
