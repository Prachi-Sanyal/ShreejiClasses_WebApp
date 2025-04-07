const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  date: {
    type: String, // Storing date as string (e.g., "Mon Apr 01 2024")
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Event", EventSchema);
