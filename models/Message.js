const mongoose = require('mongoose');
const conn = require('../config/userDB');

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Types.ObjectId,
            ref: 'conversation'
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: String,
            default: ''
        },
        files: {
            type: Array,
            default: []
        },
        likes: {
            type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Message = conn.model('message', MessageSchema);

module.exports = Message;
