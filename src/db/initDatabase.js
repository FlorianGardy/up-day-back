const sequelize = require("./connect");
const createAdmin = require("./user/createAdmin");

async function initDatabase(options) {
  const { testConnection, clearTables, checkAdmin } = options;

  // Test the connection to the database
  if (testConnection) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
      return false;
    }
  }

  // Model definition
  await require("./user/user.model");
  await require("./event/event.model");
  // TODO: Add associations

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
