const Router = require('express').Router();
const postCtrl = require('../controllers/post.controllers');
const { auth } = require('../middleware/auth');

Router.get('/post/:id', auth, postCtrl.getPost);
Router.get('/posts', auth, postCtrl.getPosts);
Router.get('/posts/:id', auth, postCtrl.getUserPosts);
Router.get('/posts/:id/saved', auth, postCtrl.getSavedPost);
Router.get('/posts_discover', auth, postCtrl.getPostsDiscover);

Router.post('/post', auth, postCtrl.createPost);

Router.patch('/post', auth, postCtrl.updatePost);
Router.patch('/post/:id/like', auth, postCtrl.likePost);
Router.patch('/post/:id/unlike', auth, postCtrl.unlikePost);
Router.patch('/saved_post/:id', auth, postCtrl.savedPost);
Router.patch('/unsaved_post/:id', auth, postCtrl.unSavedPost);

Router.delete('/post/:id', auth, postCtrl.deletePost);

module.exports = Router;
