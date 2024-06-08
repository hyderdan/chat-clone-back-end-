const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {CONNECT} = require('./config');
const {userROutes} = require('./routes/userRoutes');
const socketIo = require('socket.io');
const http = require('http');
const app = express();
const PORT = 3000;
CONNECT();
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors(
    {
        origin: "http://localhost:4200",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    }
));

app.use('/users',userROutes);

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(PORT, () => {
    console.log('server starts at port',PORT)
});