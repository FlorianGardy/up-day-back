const Joi = require("@hapi/joi");
const { createUser, getUsers, deleteUser } = require("../db/user/user.actions");

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
      const userInfo = { ...request.payload };

      if (
        !userInfo ||
        !userInfo.hasOwnProperty("name") ||
        !userInfo.hasOwnProperty("password") ||
        !userInfo.hasOwnProperty("role")
      ) {
        return h.response("Wrong payload").code(500);
      }

      const { name, password, email, role } = userInfo;
      return await createUser(name, password, email, role);
    }
  },
  {
    method: "DELETE",
    path: "/users/{uuid}",
    options: {
      auth: false
    },
    handler: async function(request, h) {
      return await deleteUser(request.params.uuid);
    }
  }
];
