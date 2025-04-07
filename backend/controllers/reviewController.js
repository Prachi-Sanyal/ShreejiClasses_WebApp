const Review = require("../models/Review"); 

const addReview = async (req, res) => {
  try {
    const { studentName, reviewText, rating } = req.body;

    const newReview = new Review({ studentName, reviewText, rating });
    await newReview.save();

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReview, getReviews };
