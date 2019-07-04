const Joi = require("@hapi/joi");
const { getUserByNameAndPass } = require("../db/user/user.actions");

module.exports = [
  {
    method: "POST",
    path: "/login",
    options: {
      auth: false
    },
    handler: async function(request, h) {
      if (request.payload === null) {
        return h.response("Wrong payload").code(500);
      }

      const name = request.payload.name;
      const password = request.payload.password;

      return await getUserByNameAndPass(name, password);
    }
  }
];
