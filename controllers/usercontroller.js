const { userData } = require('../models/usersModel');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
// const JWTVALUE = process.env.KEY;

const SignUp = async (req, res) => {
    try {
        const { username, phoneNo, password, confirmPass } = req.body;
        if (password !== confirmPass) {
            console.log('password doesnot match');
            res.status(202).json({ message: "password does not match" })
        }
        const userExist = await userData.findOne({ phoneNo: phoneNo });
        if (userExist) {
            console.log('user exist');
            res.status(202).json({ message: "user exist" })
        } else {
            const hashedPassword = await bcryp.hash(password, 10);
            const user = new userData({ username: username, phoneNo: phoneNo, password: hashedPassword })
            await user.save();
            res.status(202).json({ message: "Account created successfully" });
        }
    } catch (err) {
        console.log(err);
    }
};
const LoginUser = async (req, res) => {
    try {
        const { phoneNo, password } = req.body;
        const users = await userData.findOne({ phoneNo: phoneNo });
        if (!users) {
            console.log("user not exists");
            res.status(202).json({ message: "User Doesn't Exist " });

        }

        else if (users && (await bcryp.compare(password, users.password))) {
            const token = jwt.sign({ phoneNo: users.phoneNo }, process.env.KEY, {
                expiresIn: '1hr'
            });
            console.log(token);
            res.status(202).json({ message: 'welcome users', params: true, user_id: users._id, usertoken: token })
        } else {
            res.status(401).json({ message: 'incorrect password' })
        }
    } catch (err) {
        console.log(err);
    }
}
const userDeatails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userData.findById(userId);
        if (user) {
            // console.log(user);
            res.status(202).json({ userdata: user })
        }
    } catch (err) {
        console.log(err);
    }
}
const searchUser = async (req, res) => {
    try {
        const { userName } = req.body;
        // const array = [userName];
        const finalArray = [];
        const users = await userData.find({});
        if(userName){
            const filteredUsers = users.filter(user => user.username.startsWith(userName));
            console.log(filteredUsers);
            res.status(202).json({data:filteredUsers})
           
        }
      
        
        
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    SignUp, LoginUser, userDeatails, searchUser
}