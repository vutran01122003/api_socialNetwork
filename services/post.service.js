const { queryDB } = require('../helper/pagination.query');
const Post = require('../models/Post');

module.exports = {
    createPostService: async (postData) => {
        const createdPost = await Post.create(postData);
        const populatedPost = await Post.findById(createdPost._id)
            .populate('user', 'fullname username avatar followers')
            .lean();
        return populatedPost;
    },
    getPostService: async ({ postId }) => {
        return Post.findOne({ _id: postId })
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    getPostsService: async ({ queryUrl }) => {
        return queryDB(
            Post.find()
                .sort({ createdAt: -1 })
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
                    },
                    {
                        path: 'comments',
                        options: { sort: { createdAt: -1 }, limit: 2 },
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
                    }
                ])
                .lean(),
            queryUrl,
            5
        );
    },

    getUserPostsService: async ({ userId, queryUrl, limit }) => {
        const userPosts = await queryDB(
            Post.find({ user: userId })
                .sort({ createdAt: -1 })
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
                    },
                    {
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
                    }
                ])
                .lean(),
            queryUrl,
            limit
        );
        return userPosts;
    },

    getUserSavedPostsService: async ({ userId, queryUrl, limit }) => {
        const savedPosts = await queryDB(Post.find({ saved: userId }).sort({ createdAt: -1 }).lean(), queryUrl, limit);

        return savedPosts;
    },

    updatePostService: async ({ postId, updatedData }) => {
        return Post.findByIdAndUpdate(postId, updatedData, {
            new: true
        })
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    deletePostService: async (postId) => {
        return Post.findOneAndDelete({ _id: postId });
    },

    likePostService: async ({ postId, userId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $push: { likes: userId }
            },
            { new: true }
        )
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    unlikePostService: async ({ postId, userId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $pull: { likes: userId }
            },
            { new: true }
        )
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    getPostsDiscoverService: async ({ user, queryUrl, limit }) => {
        const discoverPosts = await queryDB(
            Post.find({
                user: { $nin: [user._id, ...user.following] }
            })
                .sort({ createdAt: -1 })
                .lean(),
            queryUrl,
            limit
        );

        return discoverPosts;
    },

    savePostService: async ({ userId, postId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $push: { saved: userId }
            },
            {
                new: true
            }
        )
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    unsavePostService: async ({ userId, postId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $pull: { saved: userId }
            },
            {
                new: true
            }
        )
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    findUpdatedPost: async (postId) => {
        return Post.findById(postId)
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    getPostOfCreatedCommentService: async ({ postId, createdCommentId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $push: { comments: createdCommentId }
            },
            { new: true }
        )
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    },

    getPostOfDeletedCommentService: async ({ postId, deletedCommentId }) => {
        return Post.findByIdAndUpdate(
            postId,
            {
                $pull: { comments: deletedCommentId }
            },
            { new: true }
        )
            .populate([
                {
                    path: 'user',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
                    path: 'likes',
                    model: 'user',
                    select: 'username fullname avatar followers'
                },
                {
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
                }
            ])
            .lean();
    }
};
