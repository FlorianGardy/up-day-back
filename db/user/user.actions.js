const bcrypt = require("bcrypt");
const User = require("./user.model");
const jwt = require("jsonwebtoken");

function generateJWToken(payload) {
  return jwt.sign(payload, process.env.SERVER_JWT_SECRET);
}

async function hash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Create a user
async function createUser(name, password, role) {
  try {
    const hashedPassword = await hash(password);
    const JWToken = await generateJWToken({ name, hashedPassword, role });
    const user = {
      name,
      password: hashedPassword,
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

module.exports = { createUser, getUsers };
