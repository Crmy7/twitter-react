var express = require('express');
var router = express.Router();

const addPost = require("../services/post/addPost");
const getPosts = require("../services/post/getPosts"); // Correction du fichier importé

// Route pour récupérer les posts
router.get('/posts', getPosts);

// Route pour ajouter un post
router.post('/posts', addPost);

module.exports = router;
