const mongoose = require("mongoose");
const connectMongodb = require("../helper/connection.mongodb");
const {
    MONGO_INITDB_HOST,
    MONGO_INITDB_DATABASE,
    MONGO_INITDB_PORT,
    MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD,
    ATLAS_URI,
    ATLAS_USERNAME,
    ATLAS_PASSWORD,
    ATALS_DATABASE
} = process.env;

class Database {
    connection = null;

    constructor() {
        this.connect();
    }

    static getInstance() {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    async connect() {
        this.connection = ATLAS_URI
            ? connectMongodb(ATLAS_URI)
            : connectMongodb(`mongodb://${MONGO_INITDB_HOST}:${MONGO_INITDB_PORT}/`, {
                  user: MONGO_INITDB_ROOT_USERNAME,
                  pass: MONGO_INITDB_ROOT_PASSWORD,
                  dbName: MONGO_INITDB_DATABASE
              });

        this.connection.on("connected", function () {
            console.log(`${this.name} connected`);
        });

        this.connection.on("error", function (error) {
            console.log("MongoDB error:", JSON.stringify(error));
        });
    }

    getConnection() {
        return this.connection;
    }

    disconnect() {
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        } else {
            console.log("MongoDB connection already closed");
        }
    }
}

module.exports = Database;
