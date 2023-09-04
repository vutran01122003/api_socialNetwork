const mongoose = require('mongoose');
const { Schema } = mongoose;
const conn = require('../config/userDB');
const cloudinary = require('../config/cloudinary');

const PostSchema = new Schema(
    {
        content: {
            type: String,
            default: ''
        },
        saved: {
            type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
            default: []
        },
        files: {
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

PostSchema.pre('findOneAndDelete', async function (next) {
    try {
        const postId = this.getQuery()._id;
        const Post = await this.model.findById(postId);
        const Comment = require('./Comment');
        for (let file of Post.files) {
            cloudinary.uploader.destroy(file.id, {
                resource_type: file.url.includes('/video/') ? 'video' : 'image'
            });
        }
        // Bucket Partern can resolve but too late...
        for (let originCommentId of Post.comments) {
            await Comment.findOneAndDelete({ _id: originCommentId });
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Post = conn.model('post', PostSchema);

module.exports = Post;
