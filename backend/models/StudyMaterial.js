const mongoose = require("mongoose");

const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  selectedCourse: {
    type: String,
    enum: ["Grade 6-10", "Grade 11-12 Science", "JEE/NEET/GUJCET Preparation", "SOF Olympiad"],
    required: true,
  },
  studentClass: {
    type: String,
    enum: ["6", "7", "8", "9", "10", "11", "12", "Others"],
    required: true,
  },
  subjects: {
    type: String,
    enum: ["Maths", "Science", "English", "Social Science", "Physics", "Chemistry", "Biology"],
    required: true,
  },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 Reference to teacher
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StudyMaterial", StudyMaterialSchema);


{/*

const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true, trim: true },
  selectedCourse: { type: String, required: true, trim: true },  // New field
  studentClass: { type: String, required: true, trim: true },   // New field
  subjects: { type: String, required: true, trim: true }, // New field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudyMaterial", studyMaterialSchema);


*/}