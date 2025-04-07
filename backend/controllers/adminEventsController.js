const Event = require("../models/adminEvents");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Add new event
exports.addEvent = async (req, res) => {
  const { date, note } = req.body;

  if (!date || !note) {
    return res.status(400).json({ message: "Date and note are required" });
  }

  try {
    let event = await Event.findOne({ date });

    if (event) {
      event.note = note;
      await event.save();
      return res.status(200).json({ message: "Event updated successfully", event });
    }

    event = new Event({ date, note });
    await event.save();
    res.status(201).json({ message: "Event added successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  const { date } = req.params;

  try {
    const event = await Event.findOneAndDelete({ date });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
