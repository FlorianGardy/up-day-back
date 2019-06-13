const Sequelize = require("sequelize");
const sequelize = require("../../db/connect");

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
    }
  },
  {
    // options
  }
);

module.exports = User;
