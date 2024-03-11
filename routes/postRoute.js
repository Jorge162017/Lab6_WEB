'use strict'

var express = require('express');
var postController = require('../controllers/postController');
var api = express.Router();

api.get('/posts', postController.getPosts);
api.get('/posts/:postId', postController.getPostById);
api.post('/posts', postController.savePost);
api.put('/posts/:postId', postController.updatePost);
api.delete('/posts/:postId', postController.deletePost);

module.exports = api;