const Comment = require('../models/Comment');

module.exports = {
    createCommentService: async (data) => {
        return await Comment.create(data);
    },

    createReplyCommentService: async ({ originCommentId, createdCommentId }) => {
        return await Comment.findByIdAndUpdate(originCommentId, {
            $push: { reply: createdCommentId }
        }).lean();
    },

    updateCommentService: async ({ commentId, content }) => {
        return await Comment.findByIdAndUpdate(commentId, {
            content: content
        });
    },

    updateLikedCommentService: async ({ commentId, userId }) => {
        return Comment.findByIdAndUpdate(
            commentId,
            {
                $push: {
                    likes: userId
                }
            },
            { new: true }
        ).lean();
    },

    updateUnlikedCommentService: async ({ commentId, userId }) => {
        return Comment.findByIdAndUpdate(
            commentId,
            {
                $pull: {
                    likes: userId
                }
            },
            { new: true }
        ).lean();
    },

    deleteCommentService: async (commentId) => {
        return Comment.findOneAndDelete({ _id: commentId }).exec();
    }
};
