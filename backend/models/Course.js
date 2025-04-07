const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  board: { type: [String], default: [] },
  subjects: { type: [String], required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  highlights: { type: [String], required: true },
  weeklyTests: { type: Boolean, default: true },
  imageUrl: { type: String, required: true },
  additionalDetails: { type: String, required: true }
});

module.exports = mongoose.model('Course', courseSchema);
