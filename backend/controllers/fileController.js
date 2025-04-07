const cloudinary = require('../config/cloudinary');
const File = require('../models/File');


const upload = require("../middlewares/multer"); 

exports.uploadFile = async (req, res) => {
  try {
    console.log("➡️ Upload Request Body:", req.body);
    console.log("➡️ Uploaded File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "❌ No file uploaded" });
    }

    const newFile = new File({
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      uploadedBy: req.user ? req.user._id : "Unknown",
      selectedCourse: req.body.selectedCourse,
      studentClass: req.body.studentClass,
      subjects: req.body.subjects,
      materialType: req.body.materialType,
    });

    await newFile.save();
    console.log("✅ File saved to database:", newFile);

    return res.status(201).json({ message: "✅ File uploaded successfully!", file: newFile });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};


exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json({ downloadUrl: file.fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const filters = {};
    if (req.query.selectedCourse) filters.selectedCourse = req.query.selectedCourse;
    if (req.query.studentClass) filters.studentClass = req.query.studentClass;
    if (req.query.subjects) filters.subjects = req.query.subjects;
    if (req.query.materialType) filters.materialType = req.query.materialType;

    const files = await File.find(filters).populate('uploadedBy', 'name email');
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.editFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const updates = req.body; 

    const updatedFile = await File.findByIdAndUpdate(fileId, updates, { new: true });
    if (!updatedFile) return res.status(404).json({ message: "File not found" });

    res.status(200).json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    const publicId = file.fileUrl.split('/').pop().split('.')[0];

    await cloudinary.uploader.destroy(`study_materials/${file.subject}/${publicId}`);

    await File.findByIdAndDelete(fileId);
    
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFilesBySubject = async (req, res) => {
  try {
    const groupedFiles = await File.aggregate([
      { $group: { _id: "$subjects", files: { $push: "$$ROOT" } } }
    ]);

    res.status(200).json(groupedFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFilteredFiles = async (req, res) => {
  try {
    const filters = {};
    if (req.query.selectedCourse) filters.selectedCourse = req.query.selectedCourse;
    if (req.query.studentClass) filters.studentClass = req.query.studentClass;
    if (req.query.subjects) filters.subjects = req.query.subjects;
    if (req.query.materialType) filters.materialType = req.query.materialType;

    const files = await File.find(filters);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.viewFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json({ fileUrl: file.fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

