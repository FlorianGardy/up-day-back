const should = require("should");
const { init } = require("../server");
const Event = require("../resources/events/event.model");

describe("# Events", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## POST /events", () => {
    it("responds with 500 when no datas are send", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: {}
      });
      should(res.statusCode).equal(500);
    });

    it("responds with 200 and data when datas send", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/events",
        payload: {
          date: "2019-06-04T12:59:00.000Z",
          type: "pipi",
          nature: "normale",
          volume: "+++",
          context: "fuite",
          comment: "pipi",
          user_id: "10"
        }
      });
      should(res.statusCode).equal(200);
      should.exist(res.payload);
    });

    it("datas exist in db when sended", async () => {
      const event = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: "fuite",
        comment: "pipi",
        user_id: "1"
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

  describe("## GET /events/userId", () => {
    it("responds with 200", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events/1"
      });
      should(res.statusCode).equal(200);
    });

    it("return an empty array if given user id doesnt exist", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events/9999999999"
      });
      should(res.statusCode).equal(200);
      const payload = JSON.parse(res.payload);
      should(payload).match([]);
    });

    it("return an array with events for the given user id", async () => {
      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: "fuite",
        comment: "pipi",
        user_id: "1"
      };

      const event2 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: "fuite",
        comment: "pipi",
        user_id: "1"
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

  describe("## GET /events", () => {
    it("responds with 200", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events"
      });
      should(res.statusCode).equal(200);
    });

    it("responds an empty event list", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/events"
      });
      const payload = JSON.parse(res.payload);
      should(payload).deepEqual([]);
    });

    it("responds an event list with two event", async () => {
      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: "fuite",
        comment: "pipi",
        user_id: "1"
      };
      const event2 = {
        date: "2019-06-05T13:59:00.000Z",
        type: "pipi",
        nature: "mitigé",
        volume: "+",
        context: "normale",
        comment: "gros pipi",
        user_id: "1"
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
});
