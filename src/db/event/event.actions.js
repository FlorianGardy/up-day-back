const Event = require("./event.model");

// Delete an event
async function deleteEvent(id) {
  try {
    // If no param, return {}
    if (!id) {
      return 0;
    }

    // If the event doesn't exist in the database, return {}
    const eventId = await Event.findOne({
      where: { id: id }
    });
    if (!eventId) {
      return 0;
    }

    // Delete the event and return true
    return await Event.destroy({
      where: {
        id: id
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  deleteEvent
};
