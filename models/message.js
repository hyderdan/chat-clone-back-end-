const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:{
        Type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true

    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    message:String,
    timetamp:{
        type:Date,
        default:Date.now
    }
});

const Message = mongoose.model('message',messageSchema);
module.exports = {
    Message
}