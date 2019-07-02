const Sequelize = require("sequelize");
const sequelize = require("../connect");
const User = require("../user/user.model");

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
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    // options
  }
);

User.hasMany(Event, {
  foreignKey: "userId",
  constraints: false
});
Event.belongsTo(User, {
  // foreignKey: 'ingredientId',
  constraints: false
});

module.exports = Event;
