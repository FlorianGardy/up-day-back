const Event = require("../db/event/event.model");
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const User = require("../db/user/user.model");

module.exports = [
  {
    method: "GET",
    path: "/events",
    handler: async function(request, h) {
      const isAdmin = await User.findOne({
        where: { uuid: request.auth.credentials.uuid, role: "admin" }
      });
      try {
        return isAdmin
          ? await Event.findAll({ order: [["date", "ASC"]] })
          : await Event.findAll({
              where: { uuid: request.auth.credentials.uuid },
              order: [["date", "ASC"]]
            });
      } catch (err) {
        console.log(err);
      }
    }
  },

  {
    method: "GET",
    path: "/events/{uuid}",
    handler: async function(request, h) {
      try {
        const { uuid } = request.params;
        return await Event.findAll({
          where: {
            uuid
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    options: {
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
        // If the uuid from the payload is different from the the one from the token, throw error 400
        if (request.auth.credentials.uuid !== request.payload.uuid) {
          return Boom.badRequest("invalid uuid");
        }

        if (request.payload.context || request.payload.context === "") {
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
      validate: {
        payload: {
          date: Joi.string().required(),
          type: Joi.string().required(),
          nature: Joi.string().required(),
          volume: Joi.string().required(),
          context: [Joi.string(), Joi.any().allow(null)],
          comment: [Joi.string(), Joi.any().allow(null)],
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

        // If the uuid of the event to delete is different from the the one from the token, throw error 400
        const eventToDelete = await Event.findOne({ where: { id: eventId } });
        if (
          eventToDelete &&
          request.auth.credentials.uuid !== eventToDelete.uuid
        ) {
          return Boom.badRequest("invalid uuid");
        }

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
