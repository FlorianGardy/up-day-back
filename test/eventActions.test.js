const should = require("should");
const { init } = require("../src/server");
const Event = require("../src/db/event/event.model");
const { deleteEvent } = require("../src/db/event/event.actions");

describe("# Event actions (database functions)", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## deleteEvent", () => {
    it("should return 0 if the params are not properly set", async () => {
      const nbDeletedEvents = await deleteEvent();
      should(nbDeletedEvents).equal(0);
    });

    it("should return 0 if the event doesn't exist in the database", async () => {
      const nbDeletedEvents = await deleteEvent("1");
      should(nbDeletedEvents).equal(0);
    });

    it("should return true if the event has been correctly deleted in the database", async () => {
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

      const nbDeletedEvents = await deleteEvent(1);
      should(nbDeletedEvents).equal(1);
    });
  });
});
