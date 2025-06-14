const conn = require('../dbs/database.connection').getInstance().getConnection();
const { Schema } = require('mongoose');

const CommentSchema = new Schema(
    {
        postId: Schema.Types.ObjectId,
        parentCommentId: Schema.Types.ObjectId,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        userRef: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        content: {
            type: String,
            required: true
        },
        likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        numberOfChildComment: Number
    },
    {
        timestamps: true
    }
);

CommentSchema.pre('findOneAndDelete', async function (next) {
    try {
        const Post = require('./Post');
        const commentId = this.getQuery()._id;
        const comment = await this.model.findById(commentId);
        const postId = comment.postId;

        const result = await Comment.deleteMany({ parentCommentId: commentId });
        await Post.findByIdAndUpdate(postId, {
            $inc: { numberOfComment: -result.deletedCount }
        });
        next();
    } catch (error) {
        next(error);
    }
});

const Comment = conn.model('comment', CommentSchema);

module.exports = Comment;
