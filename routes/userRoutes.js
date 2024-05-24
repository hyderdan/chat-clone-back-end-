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

module.exports = {
    userROutes
}