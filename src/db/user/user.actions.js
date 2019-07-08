const User = require("./user.model");
const bcrypt = require("bcrypt");

async function deleteUser(uuid) {
  return await User.destroy({ where: { uuid } });
}

// Check if a token is valid
async function findUuidByToken(JWToken) {
  try {
    const userInstance = await User.findOne({
      where: { token: JWToken },
      attributes: ["uuid"]
    });

    if (userInstance) {
      return userInstance.get({
        plain: true
      }).uuid;
    }
  } catch (error) {
    console.log(error);
  }
}

// Get a user by Name & Password
async function getUserByNameAndPass(name, password) {
  if (!name || !password) {
    if (process.env.DEBUG === "true") {
      console.log(`ERROR! getUserByNameAndPass function - wrong params`);
      console.log(`name = ${name}, password = ${password}\n`);
    }
    return {};
  }

  const userInstance = await User.findOne({
    where: { name }
  });
  if (!userInstance) return {};
  const user = userInstance.get({ plain: true });

  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) return {};

  return user;
}

module.exports = {
  deleteUser,
  findUuidByToken,
  getUserByNameAndPass
};
