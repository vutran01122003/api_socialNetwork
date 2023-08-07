const createError = require('http-errors');
const {
    getPostService,
    getUserPostsService,
    updatePostService,
    deletePostService,
    likePostService,
    unlikePostService,
    getPostsDiscoverService,
    savePostService,
    getPostsService,
    unsavePostService,
    createPostService
} = require('../services/post.service');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    createPost: async (req, res, next) => {
        try {
            const postData = req.body.postData;

            const createdPost = await createPostService(postData);

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

            const post = await getPostService({ _id: postId });

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
            const posts = await getPostsService(
                {
                    user: [user._id, ...user.following]
                },
                req.query
            );

            if (!posts) throw createError.NotFound('posts not found');

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

            const posts = await getUserPostsService({
                user: id
            });

            if (!posts) throw createError.NotFound('posts not found');

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
            const newPost = await updatePostService({ postId, updatedData });

            if (!newPost) throw createError.NotFound('post not found');

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

            const deletedPost = await deletePostService(postId);

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

            const post = await likePostService({
                postId,
                userId: user._id
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

            const post = await unlikePostService({
                postId,
                userId: user._id
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

            const posts = await getPostsDiscoverService(user);

            res.status(200).send({
                status: 'get posts discover successful',
                posts
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    savedPost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const userId = res.locals.userId;

            if (!postId) throw createError('post not found');

            const updatedUser = await savePostService({
                userId,
                postId
            });

            res.status(200).send({
                status: 'post saved successfully',
                user: updatedUser
            });
        } catch (error) {
            next(error);
        }
    },

    unSavedPost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const userId = res.locals.userId;

            if (!postId) throw createError('post not found');

            const updatedUser = await unsavePostService({
                userId,
                postId
            });

            res.status(200).send({
                status: 'post unsaved successfully',
                user: updatedUser
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
};
