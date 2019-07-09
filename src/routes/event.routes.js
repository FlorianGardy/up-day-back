const Event = require("../db/event/event.model");
const Joi = require("@hapi/joi");

module.exports = [
  {
    method: "GET",
    path: "/events",
    options: {
      auth: false
    },
    handler: async function() {
      try {
        return await Event.findAll();
      } catch (err) {
        console.log(err);
      }
    }
  },
  {
    method: "GET",
    path: "/events/{uuid}",
    handler: async function(request) {
      try {
        const uuid = request.params.uuid;
        return await Event.findAll({
          where: {
            uuid: uuid
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    options: {
      auth: false,
      validate: {
        params: {
          uuid: Joi.string().required()
        }
      }
    }
  },
  {
    method: "POST",
    path: "/events",
    handler: async function(request, h) {
      try {
        console.log(request.payload);

        if (request.payload.context) {
          request.payload = {
            ...request.payload,
            context: request.payload.context.split("|")
          };
        }
        return await Event.create(request.payload);
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
          uuid: Joi.string().required()
        }
      }
    }
  },
  {
    method: "DELETE",
    path: "/events/{id}",
    handler: async function(request, h) {
      try {
        const eventId = request.params.id;
        return await Event.destroy({
          where: {
            id: eventId
          }
        });
      } catch (err) {
        console.log(err);
      }
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
