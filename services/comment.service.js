const Comment = require('../models/Comment');

module.exports = {
    createCommentService: async (data) => {
        return Comment.create(data);
    },

    createReplyCommentService: async ({ originCommentId, createdCommentId }) => {
        return Comment.findByIdAndUpdate(originCommentId, {
            $push: { reply: createdCommentId }
        });
    },

    updateCommentService: async (commentData) => {
        return Comment.findByIdAndUpdate(commentData.commentId, {
            content: commentData.content
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
        );
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
        );
    },

    deleteCommentService: async (commentId) => {
        return Comment.deleteOne({ _id: commentId }).exec();
    }
};
