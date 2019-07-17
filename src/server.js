"use strict";
require("dotenv").config();

var cors = require("cors");
const Hapi = require("@hapi/hapi");

const { User } = require("./db/user/user.model");
const initDatabase = require("./db/initDatabase");

const server = Hapi.server({
  port: process.env.SERVER_PORT,
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
          return await User.findOne({ where: { token } });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

async function registerRoutes() {
  server.route(require("./routes/event.routes"));
  server.route(require("./routes/user.routes"));
  server.route(require("./routes/login.routes"));
}

let _isInit = false;
exports.init = async () => {
  await initDatabase({
    clearTables: true,
    testConnection: false,
    checkAdmin: false
  });
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
  await initDatabase({
    clearTables: false,
    testConnection: true,
    checkAdmin: true
  });

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
