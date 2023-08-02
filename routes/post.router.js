const Router = require('express').Router();
const postCtrl = require('../controllers/post.controllers');
const jwtService = require('../helper/jwt.service');

Router.get('/post/:id', jwtService.verifyAccessToken, postCtrl.getPost);
Router.get('/posts', jwtService.verifyAccessToken, postCtrl.getPosts);
Router.get('/posts/:id', jwtService.verifyAccessToken, postCtrl.getUserPosts);
Router.get(
    '/posts_discover',
    jwtService.verifyAccessToken,
    postCtrl.getPostsDiscover
);

Router.post('/post', jwtService.verifyAccessToken, postCtrl.createPost);

Router.patch('/post', jwtService.verifyAccessToken, postCtrl.updatePost);
Router.patch('/post/:id/like', jwtService.verifyAccessToken, postCtrl.likePost);
Router.patch(
    '/post/:id/unlike',
    jwtService.verifyAccessToken,
    postCtrl.unlikePost
);

Router.delete('/post/:id', jwtService.verifyAccessToken, postCtrl.deletePost);

module.exports = Router;
