const StudentEvent = require("../models/studentEvents");

// ✅ Add or Update Event Note
const addOrUpdateEvent = async (req, res) => {
  const { date, note } = req.body;

  try {
    const event = await StudentEvent.findOneAndUpdate(
      { date },
      { note },
      { upsert: true, new: true }
    );
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error saving event", error });
  }
};

// ✅ Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await StudentEvent.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// ✅ Delete Event Note
const deleteEvent = async (req, res) => {
  const { date } = req.params;

  try {
    await StudentEvent.findOneAndDelete({ date });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

module.exports = { addOrUpdateEvent, getAllEvents, deleteEvent };
