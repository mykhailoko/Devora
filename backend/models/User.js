const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, default: "-" },
    biography: { type: String, default: "-" },
    skills: { type: String, default: "-" },
    avatar: { type: String },
    projects: [{
        name: { type: String, default: "-" },
        link: { type: String, default: "-" }
    }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
})

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel