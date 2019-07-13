const Sequelize = require("sequelize");
const sequelize = require("../connect");

const User = sequelize.define(
  "user",
  {
    // attributes
    uuid: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true
    },
    role: {
      type: Sequelize.ENUM("admin", "standard"),
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
