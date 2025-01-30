const sequelize = require("./_database");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false, // Assurez-vous que chaque post est lié à un utilisateur
    references: {
      model: User,
      key: "id",
    },
  },
});

module.exports = Post;
