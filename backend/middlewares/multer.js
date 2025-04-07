const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("📤 Uploading File:", file.originalname);
    return {
      folder: "study_materials",
      format: file.mimetype.split("/")[1], 
      resource_type: "auto",
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    console.log("🔍 Checking File Type:", file.mimetype);

    const allowedTypes = [
      "application/pdf",         
      "application/msword",      
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
      "application/vnd.ms-powerpoint", 
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", 
      "image/png",               
      "image/jpeg",              
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("❌ Invalid file type! Only PDF, Word (DOC/DOCX), PPT, and Images are allowed."), false);
    }
  },
});

module.exports = upload;
