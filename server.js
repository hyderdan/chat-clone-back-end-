const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {CONNECT} = require('./config')
const app = express();
const PORT = 3000;
CONNECT();
app.use(bodyParser.json());
app.use(cors(
    {
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    }
));


app.listen(PORT, () => {
    console.log('server starts at port',PORT)
});