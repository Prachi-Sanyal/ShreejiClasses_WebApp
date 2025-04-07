const moment = require("moment");
const Attendance = require('../models/Attendance');
const Marks = require("../models/Marks");


exports.getMonthlyDashboardData = async (req, res) => {
  try {
    const studentId = req.user.id;
    const currentMonth = moment().format("MM"); // Current month (01, 02, ..., 12)
    const currentYear = moment().format("YYYY");

    // ✅ Attendance Percentage Calculation
    const startDate = moment().startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const attendanceRecords = await Attendance.find({
      studentId,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter((record) => record.status === "Present").length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    // ✅ Monthly Progress (Marks Performance)
    const marksRecords = await Marks.find({
      studentId,
      testDate: { $gte: startDate, $lte: endDate },
    });

    let totalMarks = 0;
    let obtainedMarks = 0;
    let subjectWisePerformance = {};

    marksRecords.forEach((mark) => {
      totalMarks += mark.totalMarks;
      obtainedMarks += mark.marksObtained;

      if (!subjectWisePerformance[mark.subjects]) {
        subjectWisePerformance[mark.subjects] = { totalMarks: 0, obtainedMarks: 0 };
      }

      subjectWisePerformance[mark.subjects].totalMarks += mark.totalMarks;
      subjectWisePerformance[mark.subjects].obtainedMarks += mark.marksObtained;
    });

    const overallPercentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;

    let subjectWisePercentage = {};
    Object.keys(subjectWisePerformance).forEach((subject) => {
      const subjectData = subjectWisePerformance[subject];
      subjectWisePercentage[subject] =
        subjectData.totalMarks > 0
          ? ((subjectData.obtainedMarks / subjectData.totalMarks) * 100).toFixed(2)
          : 0;
    });

    // ✅ Monthly Report
    const monthlyReport = {
      month: moment().format("MMMM YYYY"),
      attendance: {
        present: presentDays,
        total: totalDays,
        percentage: attendancePercentage,
      },
      performance: {
        overallPercentage,
        subjectWisePercentage,
      },
    };

    res.json({
      attendancePercentage,
      overallPercentage,
      subjectWisePercentage,
      monthlyReport,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
