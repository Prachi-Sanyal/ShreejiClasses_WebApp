const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();  

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
  api_key: process.env.CLOUDINARY_API_KEY,       
  api_secret: process.env.CLOUDINARY_API_SECRET,  
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;  
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: File type not supported');
    }
  }
}).single('image');

exports.addCourse = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err });
    }

    try {
      let imageUrl = '';
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
      }

      const courseData = {
        category: req.body.category,
        board: req.body.board,
        subjects: req.body.subjects,
        duration: req.body.duration,
        description: req.body.description,
        highlights: req.body.highlights,
        weeklyTests: req.body.weeklyTests,
        imageUrl: imageUrl,
        additionalDetails: req.body.additionalDetails,
      };

      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();

      res.status(201).json(savedCourse);
    } catch (error) {
      console.error("Error adding course:", error);
      res.status(400).json({ message: 'Error adding course', error: error.message });
    }
  });
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course', error });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};
