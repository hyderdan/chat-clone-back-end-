const { userData } = require('../models/usersModel');
const bcryp = require('bcrypt');


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
        
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    SignUp
}