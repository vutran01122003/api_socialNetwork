const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports = {
    getCommentsService: async ({ postId, commentQuantity, limit }) => {
        return await Comment.find({ postId: postId, parentCommentId: { $exists: false } })
            .sort({ createdAt: -1 })
            .skip(commentQuantity)
            .limit(limit)
            .populate([
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
            ]);
    },

    getRepliesService: async ({ postId, commentId, replyQuantity, limit }) => {
        try {
            const replies = await Comment.find({
                postId,
                parentCommentId: commentId
            })
                .skip(replyQuantity)
                .limit(limit)
                .populate([
                    {
                        path: 'user',
                        model: 'user',
                        select: 'username fullname avatar'
                    },
                    {
                        path: 'userRef',
                        model: 'user',
                        select: 'username fullname avatar'
                    },
                    {
                        path: 'likes',
                        model: 'user',
                        select: 'username fullname avatar'
                    }
                ])
                .lean();

            return replies;
        } catch (error) {
            throw error;
        }
    },

    createCommentService: async (data) => {
        const parentCommentId = data?.parentCommentId;
        const result = await Promise.all([
            parentCommentId
                ? Comment.findByIdAndUpdate(parentCommentId, {
                      $inc: { numberOfChildComment: 1 }
                  })
                : null,
            Comment.create(parentCommentId ? data : { ...data, numberOfChildComment: 0 })
        ]);

        await result[1].populate({
            path: 'user',
            model: 'user',
            select: 'username fullname avatar'
        });

        return result[1];
    },

    updateCommentService: async ({ commentId, content }) => {
        return await Comment.findByIdAndUpdate(
            commentId,
            {
                content: content
            },
            {
                new: true
            }
        ).populate([
            {
                path: 'user',
                model: 'user',
                select: 'username fullname avatar'
            },
            {
                path: 'likes',
                model: 'user',
                select: 'username fullname avatar'
            },
            {
                path: 'userRef',
                model: 'user',
                select: 'username fullname avatar'
            }
        ]);
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
