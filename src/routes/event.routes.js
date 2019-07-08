const Event = require("../db/event/event.model");
const Joi = require("@hapi/joi");

module.exports = [
  {
    method: "GET",
    path: "/events",
    options: {
      auth: false
    },
    handler: function() {
      return Event.findAll().catch(err => console.log(err));
    }
  },
  {
    method: "GET",
    path: "/events/{userId}",
    handler: function(request) {
      const userId = request.params.userId;
      return Event.findAll({
        where: {
          userId: userId
        }
      }).catch(err => console.log(err));
    },
    options: {
      auth: false,
      validate: {
        params: {
          userId: Joi.number()
            .integer()
            .required()
        }
      }
    }
  },
  {
    method: "POST",
    path: "/events",
    handler: function(request, h) {
      try {
        const eventToCreate = {
          ...request.payload,
          context: request.payload.context.split("|")
        };
        return Event.create(eventToCreate);
      } catch (err) {
        console.log(err);
      }
    },
    options: {
      auth: false,
      validate: {
        payload: {
          date: Joi.string().required(),
          type: Joi.string().required(),
          nature: Joi.string().required(),
          volume: Joi.string().required(),
          context: Joi.string(),
          comment: Joi.string(),
          userId: Joi.number().integer()
        }
      }
    }
  },
  {
    method: "DELETE",
    path: "/events/{id}",
    handler: async function(request, h) {
      const eventId = request.params.id;
      return await Event.destroy({
        where: {
          id: eventId
        }
      });
    },
    options: {
      auth: false,
      validate: {
        params: {
          id: Joi.number()
            .integer()
            .required()
        }
      }
    }
  }
];
