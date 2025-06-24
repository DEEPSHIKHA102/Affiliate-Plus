const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required : false},
    name: { type: String, required: true},
    isGoogleUser:{ type: String, required: false},
    googleId: { type: String, required: false }

});

module.exports = mongoose.model('users', UserSchema);