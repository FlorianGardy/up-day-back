const Event = require("./event.model");

module.exports = [
  {
    method: "GET",
    path: "/events",
    handler: function() {
      return Event.findAll();
    }
  },
  {
    method: "GET",
    path: "/events/{id}",
    handler: function(request) {
      const userId = request.params.id;
      return Event.findAll({
        where: {
          user_id: userId
        }
      });
    }
  }
];
