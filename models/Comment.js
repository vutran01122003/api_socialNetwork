const conn = require('../config/userDB');
const { Schema } = require('mongoose');

const CommentSchemal = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: String,
            required: true
        },
        likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        reply: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
    },
    {
        timestamps: true
    }
);

const Comment = conn.model('comment', CommentSchemal);

module.exports = Comment;
