const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const User = require("../db/user/user.model");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");

function isAdmin(request) {
  return User.findOne({
    where: { uuid: request.auth.credentials.uuid, role: "admin" }
  });
}

module.exports = [
  {
    method: "GET",
    path: "/users",
    handler: async function(request, h) {
      try {
        // Throw an error 403 if the requestor is not admin
        if (!(await isAdmin(request))) {
          return Boom.forbidden("Admin only !!");
        }

        return await User.findAll();
      } catch (err) {
        console.log(err);
      }
    }
  },

  {
    method: "GET",
    path: "/users/{uuid}",
    handler: async function(request, h) {
      const { uuid } = request.params;
      try {
        // Throw an error 403 if the requestor is not admin
        if (!(await isAdmin(request))) {
          return Boom.forbidden("Admin only !!");
        }

        return await User.findOne({
          attributes: [
            "uuid",
            "name",
            "email",
            "role",
            "createdAt",
            "updatedAt"
          ],
          where: { uuid }
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  {
    method: "GET",
    path: "/users/{uuid}/events",
    handler: async function(request, h) {
      // Throw an error 403 if the requestor is not admin
      if (!(await isAdmin(request))) {
        return Boom.forbidden("Admin only !!");
      }

      const { uuid } = request.params;
      try {
        const user = await User.findOne({ where: { uuid } });
        return await user.getEvents();
      } catch (err) {
        console.log(err);
      }
    }
  },

  {
    method: "POST",
    path: "/users",
    handler: async function(request, h) {
      try {
        // Throw an error 403 if the requestor is not admin
        if (!(await isAdmin(request))) {
          return Boom.forbidden("Admin only !!");
        }

        const { name, password: rawPassword, email, role } = request.payload;

        // Check if the name already exists in the database
        const nameExist = await User.findOne({
          where: { name: name }
        });
        if (nameExist) {
          const nameExistMessage = {
            statusCode: 400,
            error: "Bad Request",
            message: "This user already exists"
          };
          return h.response(nameExistMessage).code(400);
        }

        // Generates UUID (Universal Unique Identifier)
        const uuid = uuidv1();

        // Generates hashed password
        const saltRounds = 10;
        let password = await bcrypt.hash(rawPassword, saltRounds);

        // Generates JSON Web Token
        const token = await jwt.sign(
          { uuid, name, password, email },
          process.env.SERVER_JWT_SECRET
        );

        // Creates a new user in DB
        const user = {
          uuid,
          name,
          password,
          email,
          role,
          token
        };
        return await User.create(user);
      } catch (err) {
        console.log(err);
      }
    },
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          password: Joi.string().required(),
          email: [Joi.string(), Joi.any().allow(null)],
          role: Joi.valid(["standard", "admin"]).required()
        }
      }
    }
  },
  {
    method: "DELETE",
    path: "/users/{uuid}",
    handler: async function(request, h) {
      // Throw an error 403 if the requestor is not admin
      if (!(await isAdmin(request))) {
        return Boom.forbidden("Admin only !!");
      }

      try {
        const { uuid } = request.params;
        return await User.destroy({ where: { uuid } });
      } catch (err) {
        console.log(err);
      }
    }
  }
];
