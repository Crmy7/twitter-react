const sequelize = require("./_database");

const Post = require("./Post");

sequelize.sync();

module.exports = {
    Post,
};