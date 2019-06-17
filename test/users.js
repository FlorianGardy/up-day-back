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

  describe("## POST /users", () => {
    it("responds  with 500 when no datas are sent", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {}
      });
      should(res.statusCode).equal(500);
    });

    it("responds with 200 and data when datas send", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "Jiji",
          password: "1234"
        }
      });
      should(res.statusCode).equal(200);
      should.exist(res.payload);
    });

    it("datas exist in db when sended", async () => {
      const user = {
        name: "Cocou",
        password: "1234"
      };
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: user
      });
      should(res.statusCode).equal(200);
      const payload = JSON.parse(res.payload);
      should(payload).match(user);
    });
  });
});
