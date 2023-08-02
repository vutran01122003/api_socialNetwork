const createError = require('http-errors');
const Post = require('../models/Post');
const { queryDB } = require('../helper/queryDB');
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    createPost: async (req, res, next) => {
        try {
            const postData = req.body.postData;

            const createdPost = new Post(postData);
            createdPost.populate('user', 'fullname username avatar');
            await createdPost.save();

            res.status(200).send({
                status: 'post created successfully',
                postData: createdPost
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getPost: async (req, res, next) => {
        try {
            const postId = req.params.id;

            if (!postId) throw createError.NotFound('post not found');

            if (!ObjectId.isValid(postId))
                throw createError.NotFound('post not found');

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

            if (post) {
                res.status(200).send({
                    status: 'successful',
                    post
                });
            } else {
                throw createError.NotFound('post not found');
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getPosts: async (req, res, next) => {
        try {
            const user = req.user;
            const posts = await queryDB(
                Post.find({
                    user: [user._id, ...user.following]
                })
                    .sort({ createdAt: -1 })
                    .populate('user likes comments', 'fullname username avatar')
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
                    }),
                req.query
            );

            res.send({
                status: 'get posts successfully',
                posts,
                result: posts.length
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getUserPosts: async (req, res, next) => {
        try {
            const id = req.params.id;

            if (!id) throw createError.NotFound('user not found');

            const posts = await Post.find({
                user: id
            })
                .sort({ createdAt: -1 })
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

            res.send({
                status: 'get user posts successfully',
                posts,
                result: posts.length
            });
        } catch (error) {
            next(error);
        }
    },

    updatePost: async (req, res, next) => {
        try {
            const postId = req.body.data.postId;

            if (!postId) throw createError.NotFound('post not found');

            const updatedData = req.body.data.updatedData;
            const newPost = await Post.findByIdAndUpdate(postId, updatedData, {
                new: true
            })
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
                status: 'post update successful',
                postData: newPost
            });
        } catch (error) {
            next(error);
        }
    },

    deletePost: async (req, res, next) => {
        try {
            const postId = req.params.id;

            if (!postId) throw createError.NotFound('post not found');

            const deletedPost = await Post.findByIdAndDelete(postId);
            res.status(200).send({
                status: 'post delete successful',
                postData: deletedPost
            });
        } catch (error) {
            next(error);
        }
    },

    likePost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const user = req.body.userData;

            if (!postId) throw createError.NotFound('post not found');

            const post = await Post.findByIdAndUpdate(
                postId,
                {
                    $push: { likes: user }
                },
                { new: true }
            )
                .populate('likes user', 'avatar username fullname')
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
                status: 'you liked the post',
                newPost: post
            });
        } catch (error) {
            next(error);
        }
    },

    unlikePost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const user = req.body.userData;

            const post = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: { likes: user._id }
                },
                { new: true }
            )
                .populate('likes user', 'avatar username fullname')
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
                status: 'you unliked the post',
                newPost: post
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getPostsDiscover: async (req, res, next) => {
        try {
            const user = req.user;

            const posts = await Post.find({
                user: { $nin: [user._id, ...user.following] }
            });

            res.status(200).send({
                status: 'get posts discover successful',
                posts
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
};
