const sequelize = require("./connect");
const createAdmin = require("./user/createAdmin");

async function initDatabase({ testConnection, clearTables, checkAdmin }) {
  // Test the connection to the database
  if (testConnection) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
      process.exit();
    }
  }

  // Model definition
  const User = await require("./user/user.model");
  const Event = await require("./event/event.model");
  Event.belongsTo(User, { foreignKey: "uuid", targetKey: "uuid" });
  User.hasMany(Event, { foreignKey: "uuid", sourceKey: "uuid" });

  // Synchronize server data model with database
  const syncOption = clearTables ? { force: true } : null;
  await sequelize.sync(syncOption);

  // Create admin account if no user axists in the database
  if (checkAdmin) {
    const adminAccount = await createAdmin();
    console.log(adminAccount);
  }
}

module.exports = initDatabase;
