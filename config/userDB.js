require('dotenv').config();
const connectMongoDB = require('../helper/connection.mongodb');
const { DB_PASSWORD, DB_USERNAME, DB_URI } = process.env;

const conn = connectMongoDB(DB_URI, {
    user: DB_USERNAME,
    pass: DB_PASSWORD,
    dbName: 'UserDB'
});

module.exports = conn;
