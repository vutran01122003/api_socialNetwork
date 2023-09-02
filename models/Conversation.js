const mongoose = require('mongoose');
const conn = require('../config/userDB');

const ConversationSchema = new mongoose.Schema(
    {
        recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
        readedUsers: [{ type: mongoose.Types.ObjectId, ref: 'user' }]
    },
    {
        timestamps: true
    }
);

const Conversation = conn.model('conversation', ConversationSchema);

module.exports = Conversation;
