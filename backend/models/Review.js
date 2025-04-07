const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  studentName: String,
  reviewText: String,
  rating: Number,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
