const mongoose = require('mongoose')

const StartupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    founder: { type: String, required: true },
    developers: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const StartupModel = mongoose.model('startups', StartupSchema)
module.exports = StartupModel