const Router = require('express').Router();
const postCtrl = require('../controllers/post.controllers');

Router.post('/post/:id', postCtrl.createPost);
Router.get('/post/:id', postCtrl.getPost);

module.exports = Router;
