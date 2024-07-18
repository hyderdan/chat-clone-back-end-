const { userData } = require('../models/usersModel');
const bcryp = require('bcrypt');
const { Timestamp } = require('firebase-admin/firestore');
const jwt = require('jsonwebtoken');
const { get } = require('mongoose');
// const JWTVALUE = process.env.KEY;

const userControll = (io) => {


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
            const users = await userData.find({});
            if (userName) {
                const filteredUsers = users.filter(user => user.username.startsWith(userName));
                // const filteredUserIds = filteredUsers.map(user => user._id); // Assuming user ID is stored in the _id field
                // console.log(filteredUsers);
                res.status(202).json({ data: filteredUsers, })

            }
        } catch (err) {
            console.log(err);
        }
    }
    const AddToFriendList = async (req, res) => {
        try {
            const { friend_id } = req.body;
            const { ID } = req.params;
            const user = await userData.findById(ID);
            const FriendUser = await userData.findById(friend_id);
            // console.log(user);
            const existingItemIndex = user.freindList.findIndex((item) => item.freindId.toString() === friend_id);
            const existingItemIndex2 = FriendUser.freindList.findIndex((item) => item.freindId.toString() === ID);
            const existingItem = user.Favourates.find(item => item.FavListId.toString() === friend_id);
            if (friend_id == ID) {
                console.log(`can't add your own account to your Freind List`);

            } else if (existingItem) {
                res.status(202).json({ mes: 'please remove user from favourates first' })
            }
            else if (existingItemIndex !== -1 && existingItemIndex2 !== -1) {
                user.freindList.splice(existingItemIndex, 1);
                FriendUser.freindList.splice(existingItemIndex2, 1);
                await user.save();
                await FriendUser.save();
                io.emit('friendListUpdate', { userId: ID, friendId: friend_id, newChat: 'false', action: 'remove' });
                res.status(202).json({ mes: 'user removed from your friend list' });

            } else {
                user.freindList.push({ freindId: friend_id });
                FriendUser.freindList.push({ freindId: ID });
                await user.save();
                await FriendUser.save();
                io.emit('friendListUpdate', { userId: ID, friendId: friend_id, newChat: 'true', action: 'add' });
                res.status(202).json({ mes: 'user added to your friend list' });


            }
        } catch (err) {
            console.log(err);
        }
    }
    const friends = async (req, res) => {
        try {
            const { userid } = req.params
            const user = await userData.findById(userid);
            const friendIds = user.freindList.map(item => item.freindId);
            // console.log(friendIds);
            const friendList = await userData.find({ _id: { $in: friendIds } });
            const userName = friendList.map((item)=> item.username);
                        console.log(userName);
            res.status(202).json({ friendList: friendList, friendId: friendIds, userName: userName  });
        } catch (err) {
            console.log(err);
        }
    }
    const AddToFavourates = async (req, res) => {
        try {
            const { FavId, userId } = req.body;
            const user = await userData.findById(userId);
            if (!user) {
                console.log("user NOt Found");
            }
            const existingItemIndex = user.Favourates.findIndex((item) => item.FavListId.toString() === FavId);

            if (userId == FavId) {
                console.log(`Unfortunately, we were unable to add the your account to your favorites at this time.
                        We apologize for any inconvenience this may have caused.`)
            } else if (existingItemIndex !== -1) {
                console.log("item Removed");
                user.Favourates.splice(existingItemIndex, 1);
                res.status(202).json({ message: "user removed from Favourates" })
                await user.save();
            } else {
                user.Favourates.push({ FavListId: FavId });
                await user.save();
                res.status(202).json({ message: "user Addded to Favourates" })
            }
        } catch (err) {
            console.log(err);
        }
    }

    const GetFavourates = async (req, res) => {
        try {

            const { userId } = req.params;
            const user = await userData.findById(userId);
            if (!user) {
                console.log('user Dont Exist');
            } else {
                const FavouratesIds = user.Favourates.map(item => item.FavListId);
                const FavouratesDatas = await userData.find({ _id: { $in: FavouratesIds } });
                // console.log(FavouratesDatas);
                res.status(202).json({ Favourates: FavouratesDatas, FavId: FavouratesIds });
            }

        } catch (err) {
            console.log(err);
        }
    }
    return {
        SignUp, LoginUser, userDeatails, searchUser,
        AddToFriendList, friends, AddToFavourates, GetFavourates

    }
}
module.exports = {
    userControll
}