const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { CONNECT } = require('./config');
const  {initUserRoutes} = require('./routes/userRoutes');
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

admin.initializeApp({
  credential:
    admin.credential.cert(serviceAccount),
  databaseURL:
    "https://chat-application-6f43e-default-rtdb.firebaseio.com"
});
const db = admin.database();
const sockectIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = sockectIo(server, {
  cors: {
    origin: "http://localhost:4200", // Adjust this to match your Angular app's URL
    methods: ["GET", "POST"]
  }
});
const userRoutes = initUserRoutes(io)
app.use('/users', userRoutes);

app.post('/send-mes', async (req, res) => {
  try {
    const { sender_id, message, receiver_id } = req.body;
    const messageData = { sender_id, message, receiver_id, Timestamp: Date.now() };
    db.ref('messages').push(messageData)
    res.status(200).json('message send successfullly')
  } catch (err) {
    console.log(err);
  }
});
const deleteConversation = async (senderid, receiverid) => {
  const messagesRef = db.ref('messages');
  const snapshot = await messagesRef.once('value');
  
  snapshot.forEach(childSnapshot => {
    const message = childSnapshot.val();
    const { sender_id, receiver_id } = message;

    // Check if the message is between the two users
    if ((sender_id === senderid  && receiver_id === receiverid) || (sender_id === receiverid && receiver_id === senderid)) {
      // Remove the message
      childSnapshot.ref.remove();
    }
  });
};
app.post('/del-mes', async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: 'User IDs are required' });
    }
    await deleteConversation(sender_id, receiver_id)
    res.status(200).json({ message: 'Friend and chat history deleted successfully' });
    console.log('Friend and chat history deleted successfully');
  } catch (err) {
    console.log(err);
  }
});

app.get('/get-mes/:sender_id/:receiver_id', async (req, res) => {
  const { sender_id, receiver_id } = req.params
  try {
    const messageRef = db.ref('messages');
    messageRef.once('value', (snapshot) => {
      const messages = snapshot.val();
      if (messages) {
        const filteredMessages = Object.values(messages).filter(message =>
          (message.sender_id === sender_id && message.receiver_id === receiver_id) ||
          (message.sender_id === receiver_id && message.receiver_id === sender_id)
        );
        res.status(200).json(filteredMessages);
        // console.log(filteredMessages, 'hello');
      } else {
        res.status(404).json({ error: 'No messages found' });
        console.log('No messages found');
      }
    }, (errorObject) => {
      res.status(500).json({ error: 'Error reading data' });
      console.log('Read failed: ' + errorObject.name);
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(err);
  }
});

db.ref('messages').on('child_added', (snapshot) => {
  const messages = snapshot.val();
  io.emit('new-message', messages);
  console.log(messages);
})



server.listen(PORT, () => {
  console.log('server starts at port', PORT)
});