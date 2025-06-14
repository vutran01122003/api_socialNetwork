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
    createPostService,
    getUserSavedPostsService
} = require('../services/post.service');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    createPost: async (req, res, next) => {
        try {
            const postData = req.body.postData;

            const createdPost = await createPostService(postData);

            res.status(200).send({
                status: 'Post created successfullyly',
                postData: createdPost
            });
        } catch (error) {
            next(error);
        }
    },
    getPost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            if (!postId) throw createError.NotFound('Post not found');

            if (!ObjectId.isValid(postId)) throw createError.NotFound('Post not found');

            const post = await getPostService({ postId });

            if (post) {
                res.status(200).send({
                    status: 'Get post successfully',
                    post
                });
            } else {
                throw createError.NotFound('Post not found');
            }
        } catch (error) {
            next(error);
        }
    },
    getSavedPost: async (req, res, next) => {
        try {
            const id = req.params.id;
            const savedPosts = await getUserSavedPostsService({
                userId: id,
                queryUrl: req.query,
                limit: 9
            });

            res.status(200).send({
                status: 'save post successfully',
                savedPosts
            });
        } catch (error) {
            next(error);
        }
    },
    getPosts: async (req, res, next) => {
        try {
            const { page, currentQuantity } = req.query;
            const posts = await getPostsService({
                queryUrl: {
                    page,
                    currentQuantity
                }
            });

            if (!posts) throw createError.NotFound('Posts not found');

            res.send({
                status: 'Get posts successfully',
                posts,
                result: posts.length
            });
        } catch (error) {
            next(error);
        }
    },
    getUserPosts: async (req, res, next) => {
        try {
            const id = req.params.id;

            if (!id) throw createError.NotFound('User not found');

            const posts = await getUserPostsService({
                userId: id,
                queryUrl: req.query,
                limit: 9
            });

            if (!posts) throw createError.NotFound('Posts not found');

            res.send({
                status: 'Get posts successfully',
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

            if (!postId) throw createError.NotFound('Post not found');

            const updatedData = req.body.data.updatedData;
            const newPost = await updatePostService({ postId, updatedData });

            if (!newPost) throw createError.NotFound('Post not found');

            res.status(200).send({
                status: 'Post update successfully',
                postData: newPost
            });
        } catch (error) {
            next(error);
        }
    },
    deletePost: async (req, res, next) => {
        try {
            const postId = req.params.id;

            if (!postId) throw createError.NotFound('Post not found');

            const deletedPost = await deletePostService(postId);

            res.status(200).send({
                status: 'post delete successfully',
                postData: deletedPost
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    likePost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const user = req.body.userData;

            if (!postId) throw createError.NotFound('Post not found');

            const post = await likePostService({
                postId,
                userId: user._id
            });

            res.status(200).send({
                status: 'You liked the post',
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
            next(error);
        }
    },
    getPostsDiscover: async (req, res, next) => {
        try {
            const user = req.user;

            const posts = await getPostsDiscoverService({
                user,
                queryUrl: req.query,
                limit: 12
            });

            res.status(200).send({
                status: 'get posts discover successfully',
                posts
            });
        } catch (error) {
            next(error);
        }
    },
    savedPost: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const userId = res.locals.userId;

            if (!postId) throw createError('post not found');

            const updatedPost = await savePostService({
                userId,
                postId
            });

            res.status(200).send({
                status: 'post saved successfullyly',
                updatedPost
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

            const updatedPost = await unsavePostService({
                userId,
                postId
            });

            res.status(200).send({
                status: 'post unsaved successfullyly',
                updatedPost
            });
        } catch (error) {
            next(error);
        }
    }
};
