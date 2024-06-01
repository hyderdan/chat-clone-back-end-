const monngoose = require('mongoose');

const userSchema = new monngoose.Schema({
    username: String,
    phoneNo: Number,
    password: String,
    freindList: [
        {
            freindId: {
                type: monngoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }
    ],
    Favourates: [
        {
            FavListId: {
                type: monngoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }
    ]
});

const userData = monngoose.model('users', userSchema);

module.exports = {
    userData
}