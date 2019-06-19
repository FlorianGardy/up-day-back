const Event = require("./event.model");
const Joi = require("@hapi/joi");

module.exports = [
  {
    method: "GET",
    path: "/events",
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
      return Event.create(event).catch(err => console.log(err));
    },
    options: {
      validate: {
        payload: {
          date: Joi.date().required(),
          type: Joi.string().required(),
          nature: Joi.string().required(),
          volume: Joi.string().required(),
          context: Joi.array().items(Joi.string()),
          comment: Joi.string(),
          userId: Joi.number()
            .integer()
            .required()
        }
      }
    }
  }
];
