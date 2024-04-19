const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    passHash: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    isAdmin:{
        type: Boolean,
        default: false,
    }

})

exports.User = mongoose.model('User', userSchema);