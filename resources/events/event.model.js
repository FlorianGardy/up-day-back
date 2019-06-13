const Sequelize = require("sequelize");
const sequelize = require("../../db/connect");

const Event = sequelize.define(
  "event",
  {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nature: {
      type: Sequelize.STRING,
      allowNull: false
    },
    volume: {
      type: Sequelize.STRING,
      allowNull: false
    },
    context: {
      type: Sequelize.STRING,
      allowNull: true
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true
    },
    user_id: {
      type: Sequelize.NUMERIC,
      allowNull: false
    }
  },
  {
    // options
  }
);

module.exports = Event;
