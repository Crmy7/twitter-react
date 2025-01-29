var express = require('express');
var router = express.Router();

const addPost = require("../services/post/addPost");
const getPosts = require("../services/post/getPosts");

// Ajout de la route GET /posts
router.get('/posts', getPosts);

// Ajout de la route POST /post
router.post('/posts', addPost);

module.exports = router;
