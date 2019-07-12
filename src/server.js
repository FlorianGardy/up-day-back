"use strict";
require("dotenv").config();

var cors = require("cors");
const Hapi = require("@hapi/hapi");

const User = require("./db/user/user.model");
const Event = require("./db/event/event.model");
const { createAdmin } = require("./db/user/createAdmin");

const server = Hapi.server({
  port: 3030,
  host: "localhost",
  routes: {
    cors: true
  }
});

async function registerPlugins() {
  // Authorization process
  await server.register({
    plugin: require("./plugins/authJwt"),
    options: {
      validate: async token => {
        try {
          const userInstance = await User.findOne({
            where: { token: token },
            attributes: ["uuid"]
          });

          if (userInstance) {
            return userInstance.get({
              plain: true
            }).uuid;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

async function registerRoutes() {
  // Routes
  server.route(require("./routes/event.routes"));
  server.route(require("./routes/user.routes"));
  server.route(require("./routes/login.routes"));
}

let _isInit = false;
exports.init = async () => {
  const sequelize = require("./db/connect");
  await sequelize.sync({ force: true });
  if (!_isInit) {
    await registerPlugins();
    await registerRoutes();
    _isInit = true;
  }

  await server.initialize();
  return server;
};

exports.start = async () => {
  // Database
  const sequelize = require("./db/connect");
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }

  await sequelize.sync(); // Synchronize server data model with database tables

  const adminAccount = await createAdmin(); // Create admin account if no user axists in the database
  console.log(adminAccount);

  await registerPlugins();
  await registerRoutes();

  // Start server
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

// Logs management
if (process.env.NODE_ENV !== "test") {
  server.events.on("response", function(request) {
    console.log(
      request.info.remoteAddress +
        ": " +
        request.method.toUpperCase() +
        " " +
        request.path +
        " --> " +
        request.response.statusCode
    );
  });
}

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});
