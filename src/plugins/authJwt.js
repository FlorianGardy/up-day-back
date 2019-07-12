const Boom = require("@hapi/boom");

// Auth scheme definition
const scheme = function(server, { validate }) {
  return {
    authenticate: async function(request, h) {
      const token = request.headers.authorization;
      if (!token) {
        return h.unauthenticated(Boom.forbidden("Missing token"));
      }
      const uuid = await validate(token);
      if (uuid) {
        return h.authenticated({ credentials: { token, uuid } });
      } else {
        return h.unauthenticated(Boom.forbidden("Invalid token"));
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
    server.auth.default(AUTH_JWT);
  }
};
