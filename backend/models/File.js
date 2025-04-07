const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true }, 
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

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
    required: true,
    enum: ['Maths', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology']
  },

  materialType: { 
    type: String, 
    enum: ['Notes', 'Assignment'], 
    required: true
  },

  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('File', FileSchema);
