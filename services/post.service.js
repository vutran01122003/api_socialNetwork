const { queryDB } = require('../helper/pagination.query');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports = {
    createPostService: async (postData) => {
        const createdPost = await Post.create(postData);
        const populatedPost = await Post.findById(createdPost._id)
            .populate('user', 'fullname username avatar followers')
            .exec();
        return populatedPost;
    },
    getPostService: async ({ postId }) => {
        return Post.findOne({ _id: postId })
            .populate('user likes', 'fullname username avatar followers')
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
    },

    getPostsService: async ({ user, queryUrl }) => {
        return queryDB(
            Post.find({ user })
                .sort({ createdAt: -1 })
                .populate('user likes comments', 'fullname username avatar followers')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
                    populate: [
                        {
                            path: 'user',
                            model: 'user',
                            select: 'username fullname avatar '
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
            queryUrl,
            5
        );
    },

    getUserPostsService: async ({ userId, queryUrl, limit }) => {
        const userPosts = await queryDB(
            Post.find({ user: userId })
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
                }),
            queryUrl,
            limit
        );
        return userPosts;
    },

    updatePostService: async ({ postId, updatedData }) => {
        return Post.findByIdAndUpdate(postId, updatedData, {
            new: true
        })
            .populate('user likes', 'fullname username avatar followers')
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
    },

    deletePostService: async (postId) => {
        return Post.deleteOne({ _id: postId });
    },

    likePostService: async ({ postId, userId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $push: { likes: userId }
            },
            { new: true }
        )
            .populate('likes user', 'avatar username fullname followers')
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
    },

    unlikePostService: async ({ postId, userId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $pull: { likes: userId }
            },
            { new: true }
        )
            .populate('likes user', 'avatar username fullname followers')
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
    },

    getPostsDiscoverService: async (user) => {
        return Post.find({
            user: { $nin: [user._id, ...user.following] }
        });
    },

    savePostService: async ({ userId, postId }) => {
        return User.findByIdAndUpdate(
            userId,
            {
                $push: { saved: postId }
            },
            {
                new: true
            }
        )
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    },

    unsavePostService: async ({ userId, postId }) => {
        return User.findByIdAndUpdate(
            userId,
            {
                $pull: { saved: postId }
            },
            {
                new: true
            }
        )
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'saved',
                    model: 'post'
                }
            ])
            .exec();
    },

    findUpdatedPost: async (postId) => {
        return Post.findById(postId)
            .populate('user likes', 'fullname username avatar followers')
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
    },

    getPostOfCreatedCommentService: async ({ postId, createdCommentId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $push: { comments: createdCommentId }
            },
            { new: true }
        )
            .populate('user likes', 'fullname username avatar followers')
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
    },

    getPostOfDeletedCommentService: async ({ postId, deletedCommentId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $pull: { comments: deletedCommentId }
            },
            { new: true }
        )
            .populate('user likes', 'fullname username avatar followers')
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
};
