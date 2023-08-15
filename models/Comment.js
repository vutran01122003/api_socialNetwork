const conn = require('../config/userDB');
const { Schema } = require('mongoose');

const CommentSchema = new Schema(
    {
        originCommentId: {
            type: Schema.Types.ObjectId
        },
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

CommentSchema.pre('deleteOne', async function (next) {
    try {
        const Post = require('./Post');
        const commentId = this.getQuery()._id;
        const comment = await this.model.findById(commentId);
        const reply = comment.reply;

        await Post.updateOne({ comments: commentId }, { $pull: { comments: commentId } });

        if (reply.length > 0) {
            await Comment.deleteMany({ _id: reply });
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Comment = conn.model('comment', CommentSchema);

module.exports = Comment;
