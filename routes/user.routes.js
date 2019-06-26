const Joi = require("@hapi/joi");
const { createUser, getUsers } = require("../db/user/user.actions");

module.exports = [
  {
    method: "GET",
    path: "/users",
    handler: async function() {
      return await getUsers();
    }
  },
  {
    method: "POST",
    path: "/users",
    handler: async function(request, h) {
      const { name, password, role } = request.payload;
      return await createUser(name, password, role);
    }
  }
];
