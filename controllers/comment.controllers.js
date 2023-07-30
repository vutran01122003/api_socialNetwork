const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports = {
    createComment: async (req, res, next) => {
        try {
            const { postId, commentId, ...commentData } = req.body.commentData;
            const createdComment = await Comment.create(commentData);
            let updatedPost = null;
            if (commentId) {
                await Comment.findByIdAndUpdate(commentId, {
                    $push: { reply: createdComment._id }
                });

                updatedPost = await Post.findByIdAndUpdate(postId)
                    .populate('user likes', 'fullname username avatar')
                    .populate({
                        path: 'comments',
                        options: { sort: { createdAt: -1 } },
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
                    });
            } else {
                updatedPost = await Post.findByIdAndUpdate(
                    postId,
                    {
                        $push: { comments: createdComment._id }
                    },
                    { new: true }
                )
                    .populate('user likes', 'fullname username avatar')
                    .populate({
                        path: 'comments',
                        options: { sort: { createdAt: -1 } },
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
                    });
            }

            res.status(200).send({
                status: 'successful comment',
                newPost: updatedPost
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const { postId, commentId } = req.body;
            const createdComment = await Comment.findByIdAndDelete(commentId);

            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: { comments: createdComment._id }
                },
                { new: true }
            )
                .populate('user likes', 'fullname username avatar')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
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
                });

            res.status(200).send({
                status: 'comment deleted successfully',
                newPost: updatedPost
            });
        } catch (error) {
            next(error);
        }
    },
    updateComment: async (req, res, next) => {
        try {
            const { postId, ...commentData } = req.body.commentData;
            await Comment.findByIdAndUpdate(commentData.commentId, {
                content: commentData.content
            });
            const post = await Post.findById(postId)
                .populate('user likes', 'fullname username avatar')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
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
                });

            res.status(200).send({
                status: 'edit comment successfully',
                newPost: post
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    likeComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const { userId, postId } = req.body.data;

            await Comment.findByIdAndUpdate(
                commentId,
                {
                    $push: {
                        likes: userId
                    }
                },
                { new: true }
            );

            const post = await Post.findById(postId)
                .populate('user likes', 'fullname username avatar')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
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
                });

            res.status(200).send({
                status: 'like comment successful',
                newPost: post
            });
        } catch (error) {
            next(error);
        }
    },
    unlikeComment: async (req, res, next) => {
        try {
            const commentId = req.params.id;
            const { userId, postId } = req.body.data;

            await Comment.findByIdAndUpdate(
                commentId,
                {
                    $pull: {
                        likes: userId
                    }
                },
                { new: true }
            );

            const post = await Post.findById(postId)
                .populate('user likes', 'fullname username avatar')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
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
                });
            res.status(200).send({
                status: 'unlike comment successful',
                newPost: post
            });
        } catch (error) {
            next(error);
        }
    }
};
