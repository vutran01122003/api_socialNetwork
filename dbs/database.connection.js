const mongoose = require('mongoose');
const { MONGO_INITDB_HOST, MONGO_INITDB_DATABASE, MONGO_INITDB_PORT } = process.env;

class Database {
    connection = null;

    constructor() {}

    static getInstance() {
        if (!Database.instance) Database.instance = new Database();
        return Database.instance;
    }

    async connect() {
        this.connection = mongoose.createConnection(
            `mongodb://${MONGO_INITDB_HOST}:${MONGO_INITDB_PORT}/${MONGO_INITDB_DATABASE}`
        );

        this.connection.on('connected', function () {
            console.log('MongoDB connected:::', this.name);
        });

        this.connection.on('error', function (error) {
            console.log('MongoDB error::: ', JSON.stringify(error));
        });
    }

    getConnection() {
        return this.connection;
    }

    disconnect() {
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        } else {
            console.log('MongoDB connection already closed');
        }
    }
}

module.exports = Database;
