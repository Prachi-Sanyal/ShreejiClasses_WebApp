const express = require('express');
const { markAttendance, getAttendance, getStudentsByFilter, getStudentCourses, getStudentAttendance } = require("../controllers/attendanceController");
const { authMiddleware, protectForAttendance } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/mark', authMiddleware, markAttendance);  
router.get('/view', authMiddleware, getAttendance);   
router.get('/filter', authMiddleware, getStudentsByFilter);  
router.get('/student-courses', protectForAttendance, getStudentCourses);
router.get('/student-records', protectForAttendance, getStudentAttendance);

module.exports = router;
