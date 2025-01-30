const Post = require("../../models/Post");

// Ajouter un post avec UserId et imageUrl seulement
module.exports = async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).json({ error: "Le contenu du post est obligatoire" });
    }

    const post = await Post.create({
      content: req.body.content,
      imageUrl: req.body.imageUrl || null, // Image optionnelle
      UserId: req.userId, // Utilisation de l'ID utilisateur
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    res.status(400).json({ error: "Échec de la création du post" });
  }
};
