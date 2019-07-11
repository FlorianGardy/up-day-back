const User = require("./user.model");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");
const bcrypt = require("bcrypt");

async function createAdmin() {
  try {
    // If any user is already in the database, exit
    if (await User.count()) return "No admin account created";

    // Else, create an admin user
    const name = "admin";
    const password = "admin";
    const email = "admin@upday.com";
    const role = "admin";

    const uuid = uuidv1();

    const saltRounds = 10;
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    const JWToken = await jwt.sign(
      { uuid, name, hashedPassword, email },
      process.env.SERVER_JWT_SECRET
    );

    const user = {
      uuid,
      name,
      password: hashedPassword,
      role,
      token: JWToken
    };
    await User.create(user);

    return "Admin account created";
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createAdmin
};
