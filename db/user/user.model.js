const Sequelize = require("sequelize");
const sequelize = require("../connect");

const User = sequelize.define(
  "user",
  {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM("admin", "user"),
      allowNull: false
    },
    token: {
      type: Sequelize.STRING(512),
      allowNull: false
    }
  },
  {
    // options
  }
);

module.exports = User;
