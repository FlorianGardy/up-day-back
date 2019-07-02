const Joi = require("@hapi/joi");
const { createUser, getUsers } = require("../db/user/user.actions");

module.exports = [
  {
    method: "GET",
    path: "/users",
    options: {
      auth: false
    },
    handler: async function() {
      return await getUsers();
    }
  },
  {
    method: "POST",
    path: "/users",
    options: {
      auth: false
    },
    handler: async function(request, h) {
      if (
        !request.payload.hasOwnProperty("name") ||
        !request.payload.hasOwnProperty("password") ||
        !request.payload.hasOwnProperty("role")
      ) {
        return h.response("Wrong payload").code(500);
      }

      const { name, password, email, role } = request.payload;
      return await createUser(name, password, email, role);
    }
  }
];
