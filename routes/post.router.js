const Router = require('express').Router();
const postCtrl = require('../controllers/post.controllers');

Router.post('/post/:id', postCtrl.createPost);
Router.get('/post/posts/:id', postCtrl.getPosts);
Router.get('/post/user/:id', postCtrl.getUserPosts);
Router.patch('/post', postCtrl.updatePost);
Router.delete('/post/:id', postCtrl.deletePost);
Router.patch('/post/:id/like', postCtrl.likePost);
Router.patch('/post/:id/unlike', postCtrl.unlikePost);

module.exports = Router;
