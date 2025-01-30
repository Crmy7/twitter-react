const Post = require("../../models/Post");
const User = require("../../models/User"); // Assurez-vous d'importer le modèle User

module.exports = async (req, res) => {
  try {
    const { username } = req.params;

    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Récupère les posts de l'utilisateur
    const posts = await Post.findAll({ where: { UserId: user.id } });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la récupération des posts",
      });
  }
};
