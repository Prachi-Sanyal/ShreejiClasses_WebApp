{/*

const StudyMaterial = require("../models/StudyMaterial");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for documents (PDF, DOCX, PPT, TXT, etc.)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only document files (PDF, DOCX, PPT, TXT) are allowed");
    }
  },
}).single("file");

// Upload study material
exports.uploadMaterial = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload error", message: err });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      //  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: "study_materials",
        allowed_formats: ["pdf", "jpg", "jpeg", "png", "ppt", "pptx", "doc", "docx"], // Specify allowed formats
        use_filename: true, 
        unique_filename: true,
        overwrite: true, 
        // Ensures new uploads replace older files if they have the same name
        // Prevents filename conflicts
        // Keeps original filename
        // Necessary for non-image files
      });

      // Remove the local file after upload
      fs.unlinkSync(req.file.path);

      const { title, category, uploadedBy } = req.body;
      const newMaterial = new StudyMaterial({
        title,
        category,
        fileUrl: result.secure_url.replace("/raw/upload/", "/upload/fl_attachment/"),
        uploadedBy,
      });

      await newMaterial.save();
      res.json({ message: "Study material uploaded successfully", fileUrl: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Get all study materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete study material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim(); // Remove any extra spaces or newline characters

    const material = await StudyMaterial.findById(trimmedId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Extract Cloudinary file ID from URL
    const fileUrlParts = material.fileUrl.split("/");
    const publicId = fileUrlParts[fileUrlParts.length - 1].split(".")[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // Remove from database
    await StudyMaterial.findByIdAndDelete(trimmedId);
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting material", error });
  }
};

*/}










const axios = require("axios");
const StudyMaterial = require("../models/StudyMaterial");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const mongoose = require("mongoose");
const streamifier = require("streamifier"); // add this to your dependencies

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only document files (PDF, DOCX, PPT, TXT) are allowed");
    }
  },
}).single("file");

function uploadToCloudinary(buffer, originalname) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "study_materials",
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        public_id: originalname.split(".")[0],
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}


exports.uploadMaterial = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload error", message: err });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }

      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

      const { title, category, selectedCourse, studentClass, subjects } = req.body;

      const newMaterial = new StudyMaterial({
        title,
        category,
        fileUrl: result.secure_url.replace("/raw/upload/", "/upload/fl_attachment/"),
        selectedCourse,
        studentClass,
        subjects,
        uploadedBy: req.user.id,
      });

      await newMaterial.save();
      res.json({ message: "Study material uploaded successfully", fileUrl: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};



{/*
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for documents (PDF, DOCX, PPT, TXT, etc.)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only document files (PDF, DOCX, PPT, TXT) are allowed");
    }
  },
}).single("file");

// Upload study material
exports.uploadMaterial = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload error", message: err });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      //  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: "study_materials",
        allowed_formats: ["pdf", "jpg", "jpeg", "png", "ppt", "pptx", "doc", "docx"], // Specify allowed formats
        use_filename: true, 
        unique_filename: true,
        overwrite: true, 
        
      });

      // Remove the local file after upload
      fs.unlinkSync(req.file.path);

      const { title, category, selectedCourse, studentClass, subjects } = req.body;
      const newMaterial = new StudyMaterial({
        title,
        category,
        fileUrl: result.secure_url.replace("/raw/upload/", "/upload/fl_attachment/"),
        selectedCourse,
        studentClass,
        subjects,
        uploadedBy: req.user.id, // ✅ Assign the logged-in teacher's ID

      });

      await newMaterial.save();
      res.json({ message: "Study material uploaded successfully", fileUrl: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

*/}


// Get all study materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete study material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim(); // Remove any extra spaces or newline characters

    const material = await StudyMaterial.findById(trimmedId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    // Extract Cloudinary file ID from URL
    const fileUrlParts = material.fileUrl.split("/");
    const publicId = fileUrlParts[fileUrlParts.length - 1].split(".")[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

    // Remove from database
    await StudyMaterial.findByIdAndDelete(trimmedId);
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting material", error });
  }
};






exports.getMaterialsForStudents = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Debugging

    const { selectedCourse, studentClass, subjects } = req.user;
    const selectedSubject = req.query.subject; // Subject filter from frontend (optional)

    if (!selectedCourse || !studentClass || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "Incomplete student details" });
    }

    const query = {
      selectedCourse,
      studentClass,
      subjects: selectedSubject ? selectedSubject : { $in: subjects }, // Show all subjects if no specific subject is selected
    };

    const materials = await StudyMaterial.find(query);

    if (!materials.length) {
      return res.status(404).json({ message: "No study materials available for your selection" });
    }

    res.status(200).json({ materials });
  } catch (error) {
    console.error("Error fetching study materials for student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.getMaterialsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    console.log("🟢 Received teacherId:", teacherId, "Type:", typeof teacherId);

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID format." });
    }

    const teacherObjectId = new mongoose.Types.ObjectId(teacherId);
    console.log("🔵 Converted to ObjectId:", teacherObjectId);

    const materials = await StudyMaterial.find({ uploadedBy: teacherObjectId });

    if (!materials.length) {
      return res.status(404).json({ message: "No study materials found for this teacher." });
    }

    res.status(200).json({ materials });
  } catch (error) {
    console.error("🔥 Error fetching study materials:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};






exports.downloadStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid material ID" });
    }

    const material = await StudyMaterial.findById(id);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }

    const fileUrl = material.fileUrl; // Cloudinary se file URL
    const fileName = `study_material_${Date.now()}.pdf`; // 📝 File name set

    // 🔹 File ko direct download karwao
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream", // 👈 Stream mode me file fetch karega
    });

    // 🔹 Response Headers (for Download)
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    // 🔹 File stream user ko bhej do
    response.data.pipe(res);
    
  } catch (error) {
    console.error("🔥 Error in download API:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};