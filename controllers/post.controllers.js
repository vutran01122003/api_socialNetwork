const createError = require('http-errors');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports = {
    createPost: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw createError.NotFound('user not found');

            const postData = req.body.postData;
            const createdPost = await Post.create({
                ...postData
            });

            res.status(200).send({
                status: 'post created successfully',
                postData: createdPost
            });
        } catch (error) {
            next(error);
        }
    },
    getPost: async (req, res, next) => {
        try {
            const id = req.params.id;

            const userAuth = await User.findById(id);
            const posts = await Post.find({
                user: [userAuth._id, ...userAuth.following]
            })
                .sort({ createdAt: -1 })
                .populate('user likes', 'fullname username avatar');

            res.send({
                status: 'successful post',
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
            }).populate('user likes', 'fullname username avatar');

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
            console.log(error);
            next(error);
        }
    }
};
