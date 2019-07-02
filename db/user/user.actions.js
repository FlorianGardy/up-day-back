const User = require("./user.model");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");

// Create a user
async function createUser(name, password, email, role) {
  try {
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

module.exports = { createUser, getUsers, findUuidByToken };
