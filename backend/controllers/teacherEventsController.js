const TeacherEvent = require("../models/teacherEvents");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await TeacherEvent.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { date, note } = req.body;
    const newEvent = new TeacherEvent({ date, note });
    await newEvent.save();
    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding event", error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { date } = req.params;
    await TeacherEvent.findOneAndDelete({ date });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
