
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require("moment");

const mongoose = require("mongoose");


exports.getStudentsByFilter = async (req, res) => {
  const { course, className, subject } = req.query;

  try {
    const students = await User.find({
      role: "student",
      selectedCourse: course,
      studentClass: className,
      subjects: subject
    }).select("_id name");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




exports.markAttendance = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can mark attendance" });
    }

    const { students } = req.body;
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid or empty student data." });
    }

    const attendanceData = students.map((student) => ({
      studentId: student.id,
      teacherId: req.user.id,
      date: new Date(),
      status: student.status,
      selectedCourse: student.selectedCourse,
      studentClass: student.studentClass,
      subjects: student.subjects
    }));

    await Attendance.insertMany(attendanceData);
    res.json({ message: "Attendance marked successfully" });

  } catch (err) {
    console.error("Error in markAttendance:", err);  
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.user.id });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};






exports.getStudentCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const studentId = new mongoose.Types.ObjectId(req.user.id); 

    console.log("Fetching attendance records for Student ID:", studentId);

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendanceRecords = await Attendance.aggregate([
      { $match: { studentId } }, 
      {
        $group: {
          _id: { course: "$selectedCourse", class: "$studentClass" }, 
          subjects: { $addToSet: "$subjects" }, 
          totalAttendance: { $sum: 1 }, 
          presentDays: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
          }, 
          absentDays: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
          } 
        }
      }
    ]);

    res.status(200).json({
      studentName: student.name,
      selectedCourses: student.selectedCourse,
      studentClasses: student.studentClass,
      subjects: student.subjects,
      attendanceCourses: attendanceRecords 
    });

  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};





exports.getStudentAttendance = async (req, res) => {
  try {
    const { month, year, subject, course } = req.query;
    const studentId = req.user.id; 

    if (!month || !year || !subject || !course) {
      return res.status(400).json({ message: "Month, Year, Subject, and Course are required" });
    }

    const startDate = moment(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = moment(startDate).endOf("month").toDate();

    const attendanceRecords = await Attendance.find({
      studentId,
      selectedCourse: course,
      subjects: subject,
      date: { $gte: startDate, $lte: endDate },
    }).select("date status");

    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
