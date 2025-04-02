const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    startupId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    startupName: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const ChatModel = mongoose.model('Chat', ChatSchema);
module.exports = ChatModel
