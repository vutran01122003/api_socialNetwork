require('dotenv').config();
const connectMongoDB = require('../helper/connection.mongodb');
const {
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
    MONGO_INITDB_HOST,
    MONGO_INITDB_DATABASE,
    MONGO_INITDB_PORT
} = process.env;

const conn = MONGO_INITDB_HOST
    ? connectMongoDB(`mongodb://${MONGO_INITDB_HOST}:${MONGO_INITDB_PORT}/`, {
          user: MONGO_INITDB_ROOT_USERNAME,
          pass: MONGO_INITDB_ROOT_PASSWORD,
          dbName: MONGO_INITDB_DATABASE
      })
    : connectMongoDB(`mongodb://127.0.0.1:27017/social_media`);

module.exports = conn;
