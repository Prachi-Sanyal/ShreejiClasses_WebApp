const mongoose = require("mongoose");

const teacherTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

module.exports = mongoose.model("TeacherTask", teacherTaskSchema);
