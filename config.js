const mongoose = require('mongoose');
const URL = "mongodb+srv://hyderdanish369:ham1Assi@cluster0.gyqcemy.mongodb.net/chatBot?retryWrites=true&w=majority&appName=Cluster0"

const CONNECT = async () => {
    try {
        await mongoose.connect(URL);
        console.log('DataBase Connected')
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    CONNECT
}