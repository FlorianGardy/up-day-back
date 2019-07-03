const should = require("should");
const { init } = require("../src/server");
const User = require("../src/db/user/user.model");
const { getUserByNameAndPass } = require("../src/db/user/user.actions");

describe("# User actions (database functions)", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## getUserByNameAndPass", () => {
    it.only("should return an empty object if the user doesn't exist in the database", async () => {
      const userInstance1 = await getUserByNameAndPass("myName", "myPass");
      should(userInstance1.constructor).equal(Object); // Is an object ?
      should(Object.entries(userInstance1).length).equal(0); // Is empty ?
    });

    it.only("should return an empty object if the params are not properly set", async () => {
      const userInstance2 = await getUserByNameAndPass();
      should(userInstance2.constructor).equal(Object); // Is an object ?
      should(Object.entries(userInstance2).length).equal(0); // Is empty ?

      const userInstance3 = await getUserByNameAndPass("myName");
      should(userInstance3.constructor).equal(Object); // Is an object ?
      should(Object.entries(userInstance3).length).equal(0); // Is empty ?
    });

    it.only("should return a user object if the user (name/password) exists in the database", async () => {
      const user = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236c",
        name: "myName",
        password: "myPass",
        email: "myMail@gmail.com",
        role: "standard",
        token: "myToken"
      };

      await User.create(user);

      const userInstance4 = await getUserByNameAndPass("myName", "myPass");
      user.createdAt = userInstance4.createdAt;
      user.updatedAt = userInstance4.updatedAt;

      should(userInstance4).deepEqual(user);
    });
  });
});
