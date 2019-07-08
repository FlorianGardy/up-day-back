const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const User = require("../db/user/user.model");

module.exports = [
  {
    method: "POST",
    path: "/login",
    options: {
      auth: false
    },
    handler: async function(request, h) {
      const { name, password } = request.payload;

      const userInstance = await User.findOne({
        where: { name }
      });

      // Check if the username exists in the database
      const wrongUserMessage = {
        statusCode: 400,
        error: "Bad Request",
        message: "This user doesn't exist or the password is incorrect"
      };
      if (!userInstance) return h.response(wrongUserMessage).code(400);

      const user = userInstance.get({ plain: true });

      // Check if the password provide matches the one saved in db
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) return h.response(wrongUserMessage).code(400);

      return user;
    },
    options: {
      validate: {
        payload: {
          name: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  }
];
