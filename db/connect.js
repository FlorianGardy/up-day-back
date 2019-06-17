const Sequelize = require("sequelize");

let dbName = process.env.DB_NAME;
if (process.env.NODE_ENV === "test") {
  dbName = process.env.DB_TEST;
}

module.exports = new Sequelize(
  dbName,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: true, // Turn off Console logs
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true
      }
    }
  }
);
