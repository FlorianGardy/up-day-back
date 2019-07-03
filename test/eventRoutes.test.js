const should = require("should");
const { init } = require("../src/server");
const Event = require("../src/db/event/event.model");

describe("# Events", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## GET /events", () => {
    it("returns the code 200", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events"
      });
      should(res.statusCode).equal(200);
    });

    it("returns an empty array if no event has been created", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events"
      });
      const payload = JSON.parse(res.payload);
      should(payload).deepEqual([]);
    });

    it("returns an array containing all the events existing in the database if any", async () => {
      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "gaz"],
        comment: "pipi",
        userId: 1
      };
      const event2 = {
        date: "2019-06-05T13:59:00.000Z",
        type: "pipi",
        nature: "mitigé",
        volume: "+",
        context: ["fuite", "gaz"],
        comment: "gros pipi",
        userId: 1
      };
      await Event.create(event1);
      await Event.create(event2);
      const res = await server.inject({
        method: "GET",
        url: "/events"
      });
      const payload = JSON.parse(res.payload);
      should(payload).match([event1, event2]);
    });
  });

  describe("## GET /events/userId", () => {
    it("returns the code 200 if the userId is properly filled", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events/1"
      });
      should(res.statusCode).equal(200);
    });

    it("returns the code 400 if the userId is not an integer", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events/toto"
      });
      should(res.statusCode).equal(400);
    });

    it("returns an empty array if the given userId doesn't exist", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events/9999"
      });
      should(res.statusCode).equal(200);
      const payload = JSON.parse(res.payload);
      should(payload).match([]);
    });

    it("returns an array containing the events created by the given user", async () => {
      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "gaz"],
        comment: "pipi",
        userId: 1
      };

      const event2 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "gaz"],
        comment: "pipi",
        userId: 1
      };
      await Event.create(event1);
      await Event.create(event2);
      const res = await server.inject({
        method: "GET",
        url: "/events/1"
      });
      should(res.statusCode).equal(200);
      const payload = JSON.parse(res.payload);
      should(payload).match([event1, event2]);
    });
  });

  describe("## POST /events", () => {
    it("returns the code 500 if no payload is provided", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: {}
      });
      should(res.statusCode).equal(500);
    });

    it("responds with 200 and sends the payload back if the payload is properly populated", async () => {
      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "gaz"],
        comment: "pipi",
        userId: 1
      };
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: event
      });
      should(res.statusCode).equal(200);
      const payload = JSON.parse(res.payload);
      should(payload).match(event);
    });
  });

  describe("## DELETE /events/{id}", () => {
    it.only("should return code 400 if the event doesn't exist", async () => {
      const res = await server.inject({
        method: "DELETE",
        url: "/events/1"
      });
      should(res.statusCode).equal(400);
    });

    it.only("should return code 200 if the event has been successfuly deleted", async () => {
      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "gaz"],
        comment: "pipi",
        userId: 1
      };
      await Event.create(event);

      const res = await server.inject({
        method: "DELETE",
        url: "/events/1"
      });
      should(res.statusCode).equal(200);
    });
  });
});
