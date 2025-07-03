const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    isGoogleUser: { type: String, required: false },
    googleId: { type: String, required: false },
    role: { type: String, default: 'admin' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', index: true },
    credits:{ type: Number, default:0}
});

module.exports = mongoose.model('users', UsersSchema);