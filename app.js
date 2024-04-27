require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);
require('./dbs/database.connection').getInstance().connect();

const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN_CLIENT,
        credentials: true
    }
});
global._io = io;

// Emmit event socket
const SocketService = require('./services/socket.service');
global._io.on('connection', SocketService.connection);

// Middleware
const whitelist = [process.env.DOMAIN_CLIENT, process.env.DOMAIN_CLIENT_SSL];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Router
app.use('/api', require('./routes/auth.router'));
app.use('/api', require('./routes/user.router'));
app.use('/api', require('./routes/post.router'));
app.use('/api', require('./routes/comment.router'));
app.use('/api', require('./routes/notification.router'));
app.use('/api', require('./routes/message.router'));
app.use('/api', require('./routes/password.router'));
app.use('/api', require('./routes/marketplace.router'));

// Catch error
app.use((req, res, next) => {
    return res.status(400).send({
        status: 400,
        msg: 'NOT FOUND'
    });
});

app.use((err, req, res, next) => {
    if (err) {
        res.status(err.status).send({
            status: err.status,
            msg: err.message,
            code: err?.code
        });
    }
});

module.exports = server;
