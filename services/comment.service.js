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
                            path: 'originalCommenter',
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
                                    path: 'originalCommenter',
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

    getRepliesService: async ({ postId, commentId, replyQuantity }) => {
        try {
            const post = await Post.findById(postId).populate({
                path: 'comments',
                model: 'comment'
            });

            const comment = post.comments.find((comment) => comment._id.toString() === commentId);
            const populatedComment = await comment.populate({
                path: 'reply',
                options: { sort: { createdAt: -1 }, limit: 5, skip: replyQuantity },
                select: 'user originalCommenter content likes createdAt',
                populate: [
                    {
                        path: 'user',
                        model: 'user',
                        select: 'username fullname avatar'
                    },
                    {
                        path: 'originalCommenter',
                        model: 'user',
                        select: 'username fullname avatar'
                    },
                    {
                        path: 'likes',
                        model: 'user',
                        select: 'username fullname avatar'
                    }
                ]
            });

            return populatedComment.reply;
        } catch (error) {
            throw error;
        }
    },

    createCommentService: async (data) => {
        const comment = new Comment(data);
        comment.populate([
            {
                path: 'user',
                model: 'user',
                select: 'username fullname avatar'
            },
            {
                path: 'originalCommenter',
                model: 'user',
                select: 'username fullname avatar'
            }
        ]);
        await comment.save();
        return comment;
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
