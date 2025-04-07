const User = require('../models/User');  
const Course = require('../models/Course');

const getDashboardStats = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await User.countDocuments({ role: "student" });

    // Count total teachers
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    // Count total courses
    const totalCourses = await Course.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
    });
  }
};

module.exports = { getDashboardStats };
