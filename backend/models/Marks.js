const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  studentClass: { 
    type: String, 
    enum: ['6', '7', '8', '9', '10', '11', '12', 'Others'],
    required: true
  },

  selectedCourse: {
    type: String,
    enum: ['Grade 6-10', 'Grade 11-12 Science', 'JEE/NEET/GUJCET Preparation', 'SOF Olympiad'],
    required: true
  },

  subjects: {
    type: String,
    enum: ['Maths', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology'],
    required: true
  },

  testTitle: {
    type: String,
    required: true,
    maxlength: 100
  },

  testDate: {
    type: Date,
    required: true
  },

  marksObtained: {
    type: Number,
    required: true,
    min: [0, 'Marks cannot be negative']
  },

  totalMarks: {
    type: Number,
    required: true,
    min: [1, 'Total marks must be at least 1']
  },

  percentage: {
    type: Number,
    default: function () {
      return (this.marksObtained / this.totalMarks) * 100;
    }
  },

  remarks: {
    type: String,
    maxlength: 200,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Marks', MarksSchema);
