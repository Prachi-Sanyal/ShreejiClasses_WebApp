

const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  selectedCourse: { type: String, required: true }, 
  studentClass: { type: String, required: true }, 
  subjects: { type: String, required: true } 
});

module.exports = mongoose.model("Attendance", AttendanceSchema);

