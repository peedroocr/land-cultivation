const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String
},
    {
        collection: 'UserInfo'
    }
);

mongoose.model('UserInfo', UserSchema)