const should = require("should");
const { init } = require("../src/server");
const User = require("../src/db/user/user.model");
const {
  deleteUser,
  getUserByNameAndPass
} = require("../src/db/user/user.actions");
const bcrypt = require("bcrypt");

describe("# User actions (database functions)", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## deleteUser", () => {
    it("should delete the user with the provided uid", async () => {
      const saltRounds = 10;
      let hashedPassword = await bcrypt.hash("pass", saltRounds);

      const user = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a523dd",
        name: "Chuck",
        password: hashedPassword,
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };

      await User.create(user);
      const userInstance = await getUserByNameAndPass("Chuck", "pass");
      should(userInstance).match(user);

      await deleteUser(user.uuid);
      const userInstance1 = await getUserByNameAndPass("Chuck", "pass");
      should(user).not.match(userInstance);
    });
  });

  describe("## getUserByNameAndPass", () => {
    it("should return an empty object if the user doesn't exist in the database", async () => {
      const userInstance1 = await getUserByNameAndPass("myName", "myPass");
      should(userInstance1.constructor).equal(Object); // Is an object ?
      should(Object.entries(userInstance1).length).equal(0); // Is empty ?
    });

    it("should return an empty object if the params are not properly set", async () => {
      const userInstance2 = await getUserByNameAndPass();
      should(userInstance2.constructor).equal(Object); // Is an object ?
      should(Object.entries(userInstance2).length).equal(0); // Is empty ?

      const userInstance3 = await getUserByNameAndPass("myName");
      should(userInstance3.constructor).equal(Object); // Is an object ?
      should(Object.entries(userInstance3).length).equal(0); // Is empty ?
    });

    it("should return a user object if the user (name/password) exists in the database", async () => {
      const saltRounds = 10;
      let hashedPassword = await bcrypt.hash("myPass", saltRounds);

      const user = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236c",
        name: "myName",
        password: hashedPassword,
        email: "myMail@gmail.com",
        role: "standard",
        token: "myToken"
      };

      await User.create(user);

      const userInstance = await getUserByNameAndPass("myName", "myPass");

      should(userInstance).match(user);
    });
  });
});
