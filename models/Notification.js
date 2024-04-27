const mongoose = require('mongoose');
const conn = require('../dbs/database.connection').getInstance().getConnection();

const NotificationSchema = new mongoose.Schema(
    {
        postId: mongoose.Types.ObjectId,
        url: String,
        title: String,
        avatar: String,
        postOwnerId: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        receiver: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
        content: {
            type: String,
            default: ''
        },
        file: {
            type: String,
            default: ''
        },
        readedUser: [{ type: mongoose.Types.ObjectId }]
    },
    {
        timestamps: true,
        collection: 'notification'
    }
);

const Notification = conn.model('notification', NotificationSchema);

module.exports = Notification;
