const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {CONNECT} = require('./config');
const {userROutes} = require('./routes/userRoutes')
const app = express();
const PORT = 3000;
CONNECT();
app.use(bodyParser.json());
app.use(cors(
    {
        origin: "http://localhost:4200",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    }
));

app.use('/users',userROutes);

app.listen(PORT, () => {
    console.log('server starts at port',PORT)
});