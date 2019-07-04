const should = require("should");
const { init } = require("../src/server");
const User = require("../src/db/user/user.model");
const bcrypt = require("bcrypt");

describe("# Login routes", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## POST /login", () => {
    it("should return a code 500 if the payload is not properly filled", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/login"
      });
      should(res.statusCode).equal(500);
    });

    it("should return a code 200 and the user (object) corresponding to the user/name provided", async () => {
      const saltRounds = 10;
      let hashedPassword = await bcrypt.hash("myPassword", saltRounds);

      const user = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236c",
        name: "myName",
        password: hashedPassword,
        email: "floflo@gmail.com",
        role: "standard",
        token: "myToken2"
      };
      await User.create(user);

      const res = await server.inject({
        method: "POST",
        url: "/login",
        payload: {
          name: "myName",
          password: "myPassword"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match(user);
    });
  });
});
