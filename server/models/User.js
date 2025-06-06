const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    role: {
        type: String,
        enum: ['teacher', 'user'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;