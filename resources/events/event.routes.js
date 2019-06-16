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
          userId: userId
        }
      });
    }
  },
  {
    method: "POST",
    path: "/events",
    handler: function(request) {
      const event = {
        date: request.payload.date,
        type: request.payload.type,
        nature: request.payload.nature,
        volume: request.payload.volume,
        context: request.payload.context,
        comment: request.payload.comment,
        userId: request.payload.userId
      };
      if (typeof event !== "undefined") {
        return Event.create(event);
      }
    }
  }
];
