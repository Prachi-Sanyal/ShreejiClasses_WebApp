const mongoose = require("mongoose");

const AdminTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  deadline: { type: Date, required: true },
  progress: { type: Number, default: 0 },
});

module.exports = mongoose.model("AdminTask", AdminTaskSchema);
