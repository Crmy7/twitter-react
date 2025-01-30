const Post = require("../../models/Post");
const User = require("../../models/User"); // Importer le modèle User

// Récupérer tous les posts avec le username de l'utilisateur
module.exports = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["username"], // Récupère uniquement le username
      },
      order: [["createdAt", "DESC"]], // Tri du plus récent au plus ancien
    });

    // Formater la réponse pour inclure username directement
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      username: post.User ? post.User.username : "Utilisateur inconnu",
      createdAt: post.createdAt,
    }));

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des posts" });
  }
};
