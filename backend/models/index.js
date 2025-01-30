const sequelize = require("./_database");

const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User, { foreignKey: "UserId", oneDelete: "CASCADE" });

sequelize.sync();

module.exports = {
    Post,
    User,
};