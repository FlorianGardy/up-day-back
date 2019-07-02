const should = require("should");
const { init } = require("../src/server");
const User = require("../src/db/user/user.model");

describe("# Users", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## GET /users", () => {
    it("should responds with 200", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users"
      });
      should(res.statusCode).equal(200);
    });

    it("should responds an empty array if no user has been created yet", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users"
      });
      const payload = JSON.parse(res.payload);
      should(payload).deepEqual([]);
    });

    it("should returns an array containing 2 users if 2 users exist in the database", async () => {
      const user1 = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236b",
        name: "Jojo",
        password: "1234",
        email: "jojo@gmail.com",
        role: "admin",
        token: "myToken1"
      };
      const user2 = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236c",
        name: "Floflo",
        password: "1234",
        email: "floflo@gmail.com",
        role: "standard",
        token: "myToken2"
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
          password: "1234",
          role: "admin",
          token: "secret"
        }
      });
      should(res.statusCode).equal(200);
      should.exist(res.payload);
    });
  });
});
