const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },

  selectedCourse: {
    type: String,
    enum: ['Grade 6-10', 'Grade 11-12 Science', 'JEE/NEET/GUJCET Preparation', 'SOF Olympiad'],
    required: true
  },

  studentClass: {
    type: String,
    enum: ['6', '7', '8', '9', '10', '11', '12', 'Others'],
    required: true
  },

  subjects: {
    type: String,
    enum: ['Maths', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology'],
    required: true
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
