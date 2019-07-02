const Boom = require("@hapi/boom");

// Auth scheme definition
const scheme = function(server, { validate }) {
  return {
    authenticate: async function(request, h) {
      const JWToken = request.headers.authorization;
      if (!JWToken) {
        throw Boom.badRequest("Missing token", "Custom-JWT");
      }
      const uuid = await validate(JWToken);
      if (uuid) {
        return h.authenticated({ credentials: { JWToken, uuid } });
      } else {
        throw Boom.badRequest("This user doesn't exist", "Custom-JWT");
      }
    }
  };
};

const AUTH_JWT = "default";
module.exports = {
  AUTH_JWT,
  name: "auth-jwt",
  version: "1.0.0",

  register: async function(server, options) {
    server.auth.scheme("Custom-JWT", scheme);
    server.auth.strategy(AUTH_JWT, "Custom-JWT", options);
    // server.auth.default("default");
  }
};
