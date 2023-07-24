const mongoose = require('mongoose');
const { Schema } = mongoose;
const conn = require('../config/userDB');

const PostSchema = new Schema(
    {
        content: {
            type: String,
            default: ''
        },
        images: {
            type: Array,
            default: []
        },
        comments: {
            type: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
            default: []
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

const Post = conn.model('Post', PostSchema);

module.exports = Post;
