const Post = require("../../models/Post");

// Récupérer tous les posts
module.exports = async (req, res) => {
  try {
    const posts = await Post.findAll(); // Utiliser findAll pour récupérer tous les posts
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
