const mongoose = require("mongoose");

const teacherEventSchema = new mongoose.Schema({
  date: { type: String, required: true },
  note: { type: String, required: true },
});

module.exports = mongoose.model("TeacherEvent", teacherEventSchema);
