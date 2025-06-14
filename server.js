const http = require("http");
const { Server } = require("socket.io");
const SocketService = require("./services/socket.service");
const app = require("./app");

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN_CLIENT,
        credentials: true
    }
});

server.listen(PORT, () => {
    global._io = io;
    global._io.on("connection", SocketService.connection);
    console.log(`App is running on port::: ${PORT}`);
});
