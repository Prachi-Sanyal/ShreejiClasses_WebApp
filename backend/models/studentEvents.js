const mongoose = require("mongoose");

const studentEventSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Date will be stored as a string (e.g., "Thu Apr 04 2025")
  note: { type: String, required: true },
});

const StudentEvent = mongoose.model("StudentEvent", studentEventSchema);

module.exports = StudentEvent;
