const express = require("express");
const router = express.Router();
const addPost = require("../services/post/addPost");
const authMiddleware = require("../middlewares/authMiddleware");
const getPosts = require("../services/post/getPosts"); // Correction du fichier importé
const getUserPosts = require("../services/post/getUserPosts");

// Route pour récupérer les posts
router.get("/posts", getPosts);

router.post("/posts", authMiddleware, addPost);
router.get("/users/:username/posts", getUserPosts);

module.exports = router;
