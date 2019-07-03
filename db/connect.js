const Sequelize = require("sequelize");

let dbHost = process.env.DB_HOST;
let dbPort = process.env.DB_PORT;
let dbName = process.env.DB_NAME;
let dbUser = process.env.DB_USER;
let dbPass = process.env.DB_PASS;

if (process.env.NODE_ENV === "test") {
  dbHost = process.env.DB_HOST_TEST;
  dbPort = process.env.DB_PORT_TEST;
  dbName = process.env.DB_NAME_TEST;
  dbUser = process.env.DB_USER_TEST;
  dbPass = process.env.DB_PASS_TEST;
}

module.exports = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  logging: false, // Turn off Console logs
  dialectOptions: {
    ssl: {
      require: true
    }
  }
});
