const should = require("should");
const { init } = require("../src/server");
const Event = require("../src/db/event/event.model");
const User = require("../src/db/user/user.model");

describe("# Events routes", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## GET /events", () => {
    it("should return the code 200 and an empty array if no event has been created", async () => {
      const user = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/events",
        payload: {},
        headers: {
          authorization: "tok"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).deepEqual([]);
    });

    it("should return the code 200 and an array containing all the events existing in the database if the requestor is admin", async () => {
      const user1 = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "admin",
        token: "tok"
      };
      const user2 = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Patrick",
        password: "Sebastien",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok2"
      };
      await User.create(user1);
      await User.create(user2);

      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "12345678-1234-1234-1234-123456789012"
      };
      const event2 = {
        date: "2019-06-05T13:59:00.000Z",
        type: "pipi",
        nature: "mitigé",
        volume: "+",
        context: ["fuite", "urgence"],
        comment: "gros pipi",
        uuid: "23144200-a195-11e9-be71-915c08fe32a4"
      };
      await Event.create(event1);
      await Event.create(event2);
      const res = await server.inject({
        method: "GET",
        url: "/events",
        headers: {
          authorization: "tok"
        }
      });
      const payload = JSON.parse(res.payload);
      should(res.statusCode).equal(200);
      should(payload).match([event1, event2]);
    });

    it("should return the code 200 and an array containing only the events of the requestor if he is not admin", async () => {
      const user1 = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      const user2 = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Patrick",
        password: "Sebastien",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok2"
      };
      await User.create(user1);
      await User.create(user2);

      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "12345678-1234-1234-1234-123456789012"
      };
      const event2 = {
        date: "2019-06-05T13:59:00.000Z",
        type: "pipi",
        nature: "mitigé",
        volume: "+",
        context: ["fuite", "urgence"],
        comment: "gros pipi",
        uuid: "23144200-a195-11e9-be71-915c08fe32a4"
      };
      await Event.create(event1);
      await Event.create(event2);
      const res = await server.inject({
        method: "GET",
        url: "/events",
        headers: {
          authorization: "tok"
        }
      });
      const payload = JSON.parse(res.payload);
      should(res.statusCode).equal(200);
      should(payload).match([event1]);
      should(payload).not.match([event2]);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events",
        payload: {},
        headers: {
          authorization: "toto"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## GET /events/{uuid}", () => {
    it("should return the code 200 an array containing the events created by the given user if the user (uuid) exists in the database", async () => {
      const user = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "23144200-a195-11e9-be71-915c08fe32a4"
      };

      const event2 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "23144200-a195-11e9-be71-915c08fe32a4"
      };
      await Event.create(event1);
      await Event.create(event2);
      const res = await server.inject({
        method: "GET",
        url: "/events/23144200-a195-11e9-be71-915c08fe32a4",
        headers: {
          authorization: "tok"
        }
      });
      should(res.statusCode).equal(200);
      const payload = JSON.parse(res.payload);
      should(payload).match([event1, event2]);
    });

    it("should return the code 200 an empty array if the given uuid doesn't exist", async () => {
      const user = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/events/23144200-a195-11e9-be71-915c08fe32a4",
        headers: {
          authorization: "tok"
        }
      });
      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).deepEqual([]);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events/23144200-a195-11e9-be71-915c08fe32a4",
        payload: {},
        headers: {
          authorization: "toto"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## POST /events", () => {
    it("should return the code 200 and sends the payload back if the payload is properly filled and the uuid corresponding to the token is the same as the one in the payload", async () => {
      const user = {
        uuid: "066a5380-a247-11e9-98bb-cdf025799f94",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: "fuite|urgence",
        comment: "pipi",
        uuid: "066a5380-a247-11e9-98bb-cdf025799f94"
      };
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: event,
        headers: {
          authorization: "tok"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match({
        ...event,
        context: event.context.split("|")
      });
    });

    it("should return the code 400 if the uuid corresponding to the token is different from the one in the payload", async () => {
      const user1 = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok1"
      };
      const user2 = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Patrick",
        password: "Sebastien",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok2"
      };
      await User.create(user1);
      await User.create(user2);

      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: "fuite|urgence",
        comment: "pipi",
        uuid: "12345678-1234-1234-1234-123456789012"
      };
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: event,
        headers: {
          authorization: "tok2"
        }
      });

      should(res.statusCode).equal(400);
    });

    it("should return the code 400 if the payload is not properly filled", async () => {
      const user = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: {},
        headers: {
          authorization: "tok"
        }
      });
      should(res.statusCode).equal(400);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: {},
        headers: {
          authorization: "toto"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## DELETE /events/{id}", () => {
    it("should return the code 200 and the message '0' if the event doesn't exist in the database", async () => {
      const user = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const res = await server.inject({
        method: "DELETE",
        url: "/events/1",
        headers: {
          authorization: "tok"
        }
      });
      should(res.statusCode).equal(200);
      should(res.payload).equal("0");
    });

    it("should return the code 200 and the message '1' if the event has been successfuly deleted and the uuid of the event to delete is the same as the one in the token", async () => {
      const user = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "23144200-a195-11e9-be71-915c08fe32a4"
      };
      await Event.create(event);

      const res = await server.inject({
        method: "DELETE",
        url: "/events/1",
        headers: {
          authorization: "tok"
        }
      });
      should(res.statusCode).equal(200);
      should(res.payload).equal("1");
    });

    it("should return the code 400 if the uuid of the event to delete is different from the one in the token", async () => {
      const user1 = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok1"
      };
      const user2 = {
        uuid: "23144200-a195-11e9-be71-915c08fe32a4",
        name: "Patrick",
        password: "Sebastien",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok2"
      };
      await User.create(user1);
      await User.create(user2);

      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "12345678-1234-1234-1234-123456789012"
      };
      await Event.create(event);

      const res = await server.inject({
        method: "DELETE",
        url: "/events/1",
        headers: {
          authorization: "tok2"
        }
      });
      should(res.statusCode).equal(400);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events",
        payload: {},
        headers: {
          authorization: "toto"
        }
      });

      should(res.statusCode).equal(403);
    });
  });
});
