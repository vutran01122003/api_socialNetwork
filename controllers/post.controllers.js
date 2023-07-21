const createError = require('http-errors');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports = {
    createPost: async (req, res, next) => {
        try {
            const id = req.params.id;
            if (!id) throw createError.NotFound('Not Found');

            const postData = req.body.postData;
            const createdPost = await Post.create({
                ...postData
            });

            res.status(200).send({
                status: 'posted success',
                postData: createdPost
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    getPost: async (req, res, next) => {
        try {
            const id = req.params.id;

            const userAuth = await User.findById(id);
            const posts = await Post.find({
                user: [userAuth._id, ...userAuth.following]
            });
            res.send({
                status: 'get posts success',
                posts,
                result: posts.length
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
};
