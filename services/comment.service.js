const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports = {
    getCommentsService: async ({ postId, commentQuantity }) => {
        return await Post.find({ _id: postId })
            .sort({ createdAt: -1 })
            .populate([
                {
                    path: 'comments',
                    options: { sort: { createdAt: -1 }, limit: 5, skip: commentQuantity },
                    populate: [
                        {
                            path: 'user',
                            model: 'user',
                            select: 'username fullname avatar'
                        },
                        {
                            path: 'reply',
                            model: 'comment',
                            options: { sort: { createdAt: -1 } },
                            select: 'user content likes createdAt',
                            populate: [
                                {
                                    path: 'user',
                                    model: 'user',
                                    select: 'username fullname avatar'
                                },
                                {
                                    path: 'likes',
                                    model: 'user',
                                    select: 'username fullname avatar'
                                }
                            ]
                        }
                    ]
                }
            ])
            .select('comments')
            .lean();
    },
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
