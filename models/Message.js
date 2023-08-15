const mongoose = require('mongoose');
const conn = require('../config/userDB');

const MessageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            default: ''
        },
        images: {
            type: Array,
            default: []
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        likes: {
            type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
            default: []
        },
        user: { type: mongoose.Types.ObjectId, ref: 'user' }
    },
    {
        timestamps: true
    }
);

const Message = conn.model('message', MessageSchema);

module.exports = Message;
