require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN_CLIENT,
        credentials: true
    }
});

global._io = io;

const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const postRouter = require('./routes/post.router');
const commentRouter = require('./routes/comment.router');
const notificationRouter = require('./routes/notification.router');
const messageRouter = require('./routes/message.router');
const passwordRouter = require('./routes/password.router');
const SocketService = require('./services/socket.service');

const options = {
    origin: process.env.DOMAIN_CLIENT,
    credentials: true
};

// Middleware

app.use(cors(options));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Router
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', commentRouter);
app.use('/api', notificationRouter);
app.use('/api', messageRouter);
app.use('/api', passwordRouter);

// Emmit event socket
global._io.on('connection', SocketService.connection);

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
