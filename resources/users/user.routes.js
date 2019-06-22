const User = require("./user.model");

module.exports = [
  {
    method: "GET",
    path: "/users",
    handler: function() {
      return User.findAll();
    }
  },
  {
    method: "POST",
    path: "/users",
    handler: function(request) {
      const user = {
        name: request.payload.name,
        password: request.payload.password
      };
      if (typeof user !== "undefined") {
        return User.create(user);
      }
    }
  }
];
