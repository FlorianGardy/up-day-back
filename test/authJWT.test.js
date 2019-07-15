const should = require("should");
const Hapi = require("@hapi/hapi");
const { AUTH_JWT } = require("../src/plugins/authJwt");

describe("# Auth JWT pluggin", () => {
  let server;

  beforeEach(async () => {
    server = Hapi.server({
      port: 3030,
      host: "localhost",
      routes: {
        cors: true
      }
    });
  });

  it("should responds with 403 when headers is missing", async () => {
    await server.register({
      plugin: require("../src/plugins/authJwt"),
      options: {
        validate: () => "myUuid"
      }
    });

    server.route({
      method: "GET",
      path: "/random",
      options: {
        auth: AUTH_JWT
      },
      handler: function() {
        return "hello";
      }
    });

    const res = await server.inject({
      method: "GET",
      url: "/random"
    });
    should(res.statusCode).equal(403);
  });

  it("should responds with 403 when the token is incorrect", async () => {
    await server.register({
      plugin: require("../src/plugins/authJwt"),
      options: {
        validate: () => null
      }
    });

    server.route({
      method: "GET",
      path: "/random",
      options: {
        auth: AUTH_JWT
      },
      handler: function() {
        return "hello";
      }
    });

    const res = await server.inject({
      method: "GET",
      url: "/random",
      headers: {
        authorization: "wrongToken"
      }
    });
    should(res.statusCode).equal(403);
  });

  it("should responds with 200 and the handler has an access to req.auth.credentials (token, uuid, role) when the header.athorization is set", async () => {
    await server.register({
      plugin: require("../src/plugins/authJwt"),
      options: {
        validate: () => ({ uuid: "myUuid", token: "myToken", role: "standard" })
      }
    });

    server.route({
      method: "GET",
      path: "/random",
      options: {
        auth: AUTH_JWT
      },
      handler: function(req) {
        should(req.auth.credentials.token).equal("myToken");
        should(req.auth.credentials.uuid).equal("myUuid");
        should(req.auth.credentials.role).equal("standard");

        return "yo";
      }
    });

    const res = await server.inject({
      method: "GET",
      url: "/random",
      headers: {
        authorization: "coucou"
      }
    });

    should(res.statusCode).equal(200);
  });
});
