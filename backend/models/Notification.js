const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    startupName: { type: String, required: true },
    startupId: { type: mongoose.Schema.Types.ObjectId, required: true }
})

const NotificationModel = mongoose.model('notifications', NotificationSchema)
module.exports = NotificationModel