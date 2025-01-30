const bcrypt = require("bcrypt");
const sequelize = require("./_database");
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "Le nom d'utilisateur ne peut pas être vide" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Le mot de passe ne peut pas être vide" },
    },
  },
});


// Hash the password before saving the user
User.beforeCreate(async (user) => {
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    throw new Error("Erreur lors du hachage du mot de passe");
  }
});

// Generate a token for the user with an expiration time
User.prototype.generateToken = function () {
  return jwt.sign(
    { id: this.id },
    secret,
    { expiresIn: "5d" } // Expiration de 5 jours
  );
};

// Validate the password
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
