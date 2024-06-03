const express = require('express');
const userROutes = express.Router();
const bodyParser = require('body-parser');
const userControlls = require('../controllers/usercontroller');

userROutes.use(bodyParser.json());
userROutes.use(bodyParser.urlencoded({ extended: true }));
userROutes.post('/sigUp', userControlls.SignUp);
userROutes.post('/login', userControlls.LoginUser);
userROutes.get('/singleUser/:userId', userControlls.userDeatails);
userROutes.post('/searchUser', userControlls.searchUser);
userROutes.post('/AddFriend/:ID', userControlls.AddToFriendList);
userROutes.get('/friendList/:userid', userControlls.friends);
userROutes.post('/AddToFavourate', userControlls.AddToFavourates);
userROutes.get('/GetFavourates/:userId', userControlls.GetFavourates);


module.exports = {
    userROutes
}