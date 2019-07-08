const Joi = require("@hapi/joi");
const User = require("../db/user/user.model");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");

const { getUsers, deleteUser } = require("../db/user/user.actions");

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
      try {
        const { name, password, email, role } = { ...request.payload };

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
        let hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generates JSON Web Token
        const JWToken = await jwt.sign(
          { uuid, name, hashedPassword, email },
          process.env.SERVER_JWT_SECRET
        );

        // Creates a new user in DB
        const user = {
          uuid,
          name,
          password: hashedPassword,
          email,
          role,
          token: JWToken
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
          email: Joi.string(),
          role: Joi.valid(["standard", "admin"]).required()
        }
      }
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
