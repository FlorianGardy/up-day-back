const should = require("should");
const { init } = require("../server");
const User = require("../resources/users/user.model");

describe("# Users", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## GET /users", () => {
    it("responds with 200", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users"
      });
      should(res.statusCode).equal(200);
    });

    it("responds an empty user list", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users"
      });
      const payload = JSON.parse(res.payload);
      should(payload).deepEqual([]);
    });

    it("responds an user list with two users", async () => {
      const user1 = {
        name: "Jojo",
        password: "1234"
      };
      const user2 = {
        name: "Floflo",
        password: "1234"
      };
      await User.create(user1);
      await User.create(user2);
      const res = await server.inject({
        method: "GET",
        url: "/users"
      });
      const payload = JSON.parse(res.payload);
      should(payload).match([user1, user2]);
    });
  });
});
