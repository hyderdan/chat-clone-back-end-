const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {CONNECT} = require('./config');
const {userROutes} = require('./routes/userRoutes');
const admin = require('firebase-admin');
const serviceAccount = require('./chat-application-6f43e-firebase-adminsdk-yg075-7efb60a401.json');
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

admin.initializeApp({
    credential:
    admin.credential.cert(serviceAccount) , 
    databaseURL:
    "https://chat-application-6f43e-default-rtdb.firebaseio.com"
});
const db =admin.database();

app.post('/send-mes', async (req, res) => {
    try {
        const { username, message } = req.body;
        const messageData = { username, message, Timestamp: Date.now() };
        db.ref('messages').push(messageData)
        res.status(200).json('message send successfullly')
    } catch (err) {
        console.log(err); 
    }
});
app.get('/get-mes', async(req,res)=>{
    try{
        const messageRef = db.ref('message');
        messageRef.once('value',(snapshot)=>{
            const messages = snapshot.val();
            res.status(200).json(messages);
        })
    }catch(err){
        console.log(err);
    }
})


app.listen(PORT, () => {
    console.log('server starts at port',PORT)
});