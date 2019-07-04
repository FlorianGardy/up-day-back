const User = require("./user.model");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");

// Create a user
async function createUser(name, password, email, role) {
  try {
    // Check if the name already exists in the database
    const nameExist = await User.findOne({
      where: { name: name }
    });
    if (nameExist) {
      return {
        name,
        password,
        email,
        role,
        error: "This user name already exists"
      };
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
  } catch (error) {
    console.log(error);
  }
}

// Get users list
async function getUsers() {
  try {
    return await User.findAll();
  } catch (error) {
    console.log(error);
  }
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
  createUser,
  getUsers,
  findUuidByToken,
  getUserByNameAndPass
};
