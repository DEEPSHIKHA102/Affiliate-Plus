const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required : false},
    name: { type: String, required: true},
    isGoogleUser:{ type: String, required: false},
    googleId: { type: String, required: false },
    role: { type: String, default: 'admin'},
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true}
});

module.exports = mongoose.model('users', UserSchema);