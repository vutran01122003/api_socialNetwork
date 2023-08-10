require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN_CLIENT,
        credentials: true
    }
});

global._io = io;

const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const postRouter = require('./routes/post.router');
const commentRouter = require('./routes/comment.router');
const notificationRouter = require('./routes/notification.router');
const SocketService = require('./services/socket.service');

const options = { origin: process.env.DOMAIN_CLIENT, credentials: true };

app.use(cors(options));
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 1024 * 1024 } }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', commentRouter);
app.use('/api', notificationRouter);

global._io.on('connection', SocketService.connection);

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

server.listen(PORT, () => {
    console.log(`App is running on port::: ${PORT}`);
});
