const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {CONNECT} = require('./config');
const {userROutes} = require('./routes/userRoutes');
const sockectIO = require('socket.io');
const server = http.Server(app);
const Io = sockectIO(server)
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

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Example: Send a HTML file for the root route
});

io.on('connection', (client) => {
    console.log('a user connected');
    client.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    client.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(PORT, () => {
    console.log('server starts at port',PORT)
});