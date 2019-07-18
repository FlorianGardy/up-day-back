const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User } = require("../db/user/user.model");

module.exports = [
  {
    method: "POST",
    path: "/login",
    handler: async function(request, h) {
      try {
        const { name, password } = request.payload;

        const user = await User.findOne({
          where: { name }
        });

        // Check if the username exists in the database
        const wrongUserMessage = {
          statusCode: 400,
          error: "Bad Request",
          message: "This user doesn't exist or the password is incorrect"
        };
        if (!user) return h.response(wrongUserMessage).code(400);

        // Check if the password provide matches the one saved in db
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) return h.response(wrongUserMessage).code(400);

        return user;
      } catch (err) {
        console.log(err);
      }
    },
    options: {
      auth: false,
      validate: {
        payload: {
          name: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  }
];
