const Marks = require("../models/Marks");
const User = require("../models/User");
const ExcelJS = require("exceljs");
//const { uploadToGoogleDrive, generateDriveLink } = require("../utils/googleDrive");
//const { sendPerformanceSMS } = require("../utils/twilio");
const fs = require("fs"); // Import file system module
const path = require("path");
//const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
//const { generateBarChart, generateLineChart } = require("../utils/generateCharts");




// 📌 1️⃣ Get Students by Course, Class & Subject for Marks Entry
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


exports.uploadMarks = async (req, res) => {
  try {
    // 🛑 Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can upload marks" });
    }

    const { students } = req.body; // Expecting an array of students

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid or empty student data." });
    }

    const marksData = students.map((student) => ({
      studentId: student.studentId,
      teacherId: req.user.id, // Teacher ID from logged-in user
      studentClass: student.studentClass,
      selectedCourse: student.selectedCourse,
      subjects: student.subjects,
      testTitle: student.testTitle,
      testDate: student.testDate,
      marksObtained: student.marksObtained,
      totalMarks: student.totalMarks,
      remarks: student.remarks || ""
    }));

    await Marks.insertMany(marksData);
    res.status(201).json({ message: "Marks uploaded successfully" });

  } catch (err) {
    console.error("Error in uploadMarks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

{/*
// 📌 3️⃣ Edit Marks
exports.editMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const updates = req.body;

    const updatedMarks = await Marks.findByIdAndUpdate(marksId, updates, { new: true });
    if (!updatedMarks) return res.status(404).json({ message: "Marks not found" });

    res.json({ message: "Marks updated successfully", updatedMarks });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

*/}


exports.editMarks = async (req, res) => {
  try {
    // 🛑 Check if the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can edit marks" });
    }

    const { students } = req.body; // Expecting an array of student marks updates

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid or empty student data." });
    }

    // Creating bulk operations for updating multiple students
    const bulkOperations = students.map((student) => ({
      updateOne: {
        filter: { _id: student.marksId }, // Find the marks entry by ID
        update: { $set: student.updates } // Apply updates
      }
    }));

    // Execute bulk update
    const result = await Marks.bulkWrite(bulkOperations);

    res.json({
      message: "Marks updated successfully",
      modifiedCount: result.modifiedCount // Number of documents modified
    });

  } catch (err) {
    console.error("Error in editMarks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.deleteMarks = async (req, res) => {
  try {
    // 🛑 Check if user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can delete marks" });
    }

    const { testTitle, testDate } = req.body; // Test title & date required

    if (!testTitle || !testDate) {
      return res.status(400).json({ message: "Test title and test date are required" });
    }

    // 🔥 Delete all marks where testTitle and testDate match
    const result = await Marks.deleteMany({ testTitle, testDate });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No marks found for the given test" });
    }

    res.json({ message: `Successfully deleted ${result.deletedCount} records` });
  } catch (err) {
    console.error("Error in deleteMarks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


{/*

exports.generatePerformanceReport = async (req, res) => {
  try {
      console.log("🟢 Generating Performance Report...");

      const { month, year } = req.query;
      if (!month || !year) {
          return res.status(400).json({ message: "Month and year are required!" });
      }

      const numericMonth = parseInt(month, 10);
      const numericYear = parseInt(year, 10);

      if (isNaN(numericMonth) || isNaN(numericYear) || numericMonth < 1 || numericMonth > 12) {
          return res.status(400).json({ message: "Invalid month or year provided!" });
      }

      const startDate = new Date(numericYear, numericMonth - 1, 1);
      const endDate = new Date(numericYear, numericMonth, 1);

      console.log(`📅 Fetching marks from ${startDate.toISOString()} to ${endDate.toISOString()}`);

      const marks = await Marks.find({
          testDate: { $gte: startDate, $lt: endDate }
      }).populate("studentId", "name studentClass selectedCourse subjects parentContactNumber");

      if (!marks.length) {
          return res.status(404).json({ message: "No marks found for the given month and year." });
      }

      const studentReports = {};

      marks.forEach(mark => {
          const studentId = mark.studentId._id.toString();
          if (!studentReports[studentId]) {
              studentReports[studentId] = {
                  student: mark.studentId,
                  marks: []
              };
          }
          studentReports[studentId].marks.push(mark);
      });

      const reportsDir = path.join(__dirname, "../reports");
      if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
      }

      const driveLinks = [];

      for (const studentId in studentReports) {
          const { student, marks } = studentReports[studentId];

          console.log(`📂 Processing report for ${student.name}`);

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Report");

          worksheet.addRow(["Test Title", "Test Date", "Marks Obtained", "Total Marks", "Percentage"]);

          marks.forEach(mark => {
              worksheet.addRow([
                  mark.testTitle,
                  mark.testDate.toISOString().split("T")[0],
                  mark.marksObtained,
                  mark.totalMarks,
                  ((mark.marksObtained / mark.totalMarks) * 100).toFixed(2)
              ]);
          });

          console.log(`✅ Inserted ${marks.length} rows`);

          // Generate bar and line charts
          const barChartPath = await generateBarChart(marks, student.name);
          const lineChartPath = await generateLineChart(marks, student.name);

          // Insert images into workbook
          const barImageId = workbook.addImage({ filename: barChartPath, extension: "png" });
          const lineImageId = workbook.addImage({ filename: lineChartPath, extension: "png" });

          const chartSheet = workbook.addWorksheet("Charts");
          chartSheet.addImage(barImageId, "B2:J16");
          chartSheet.addImage(lineImageId, "B18:J32");

          console.log("✅ Charts inserted into Excel");

          // Save the report
          const fileName = `performance_${student.name.replace(/\s+/g, "_")}_${month}_${year}.xlsx`;
          const filePath = path.join(reportsDir, fileName);
          await workbook.xlsx.writeFile(filePath);
          console.log(`✅ Report saved: ${filePath}`);

          // Upload to Google Drive
          const driveFileId = await uploadToGoogleDrive(filePath);
          const driveLink = await generateDriveLink(driveFileId);

          driveLinks.push({ student: student.name, parentContact: student.parentContactNumber, link: driveLink });
      }

      console.log("✅ All reports generated successfully!");

    // res.json({ message: "Reports generated successfully!", reports: driveLinks });
    return res.json({ message: "Reports generated successfully!", reports: driveLinks });


  } catch (err) {
      console.error("🔴 Error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.sendPerformanceReportSMS = async (req, res) => {
  try {

    console.log("🔵 Inside sendPerformanceReportSMS function");

    const { reports } = req.body; // Expecting an array of { parentContact, link, student }

    if (!Array.isArray(reports) || reports.length === 0) {
      return res.status(400).json({ message: "Reports array is required!" });
    }

    const results = [];

    for (const report of reports) {
      const { parentContact, link, student } = report;

      if (!parentContact || !link) {
        results.push({ parentContact, student, status: "Failed", reason: "Missing contact or link" });
        continue;
      }

      const formattedPhone = parentContact.startsWith("+91") ? parentContact : `+91${parentContact}`;


      const message = `Dear Parent, your child ${student}'s performance report is ready. View here: ${link}`;
      try {
        await sendPerformanceSMS(formattedPhone, message);
        results.push({ parentContact, student, status: "Success" });
      } catch (error) {
        console.error(`Failed to send SMS to ${parentContact}:`, error);
        results.push({ parentContact, student, status: "Failed", reason: error.message });
      }
    }

    res.json({
      message: "Performance report SMS process completed",
      results,
    });
  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

*/}

// 📌 7️⃣ Get Student Dashboard Data (Tests + Charts)
exports.getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;

    const marks = await Marks.find({ studentId }).sort({ testDate: -1 });

    const monthlyPerformance = {};
    marks.forEach((mark) => {
      const month = new Date(mark.testDate).toLocaleString("en-US", { month: "short", year: "numeric" });
      if (!monthlyPerformance[month]) monthlyPerformance[month] = { totalMarks: 0, obtainedMarks: 0 };
      monthlyPerformance[month].totalMarks += mark.totalMarks;
      monthlyPerformance[month].obtainedMarks += mark.marksObtained;
    });

    res.json({ tests: marks, monthlyPerformance });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};





exports.getTeacherMarks = async (req, res) => {
  try {
    // 🛑 Ensure the user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view their uploaded marks" });
    }

    // Find all marks uploaded by the logged-in teacher
    const teacherMarks = await Marks.find({ teacherId: req.user.id })
      .populate("studentId", "name") // Populate student names
      .sort({ testDate: 1 }); // Sort by test date ascending

    if (!teacherMarks.length) {
      return res.status(404).json({ message: "No marks found for this teacher" });
    }

    // Grouping marks by test title and date
    const groupedMarks = {};
    teacherMarks.forEach((mark) => {
      const key = `${mark.testTitle}_${mark.testDate}`;
      if (!groupedMarks[key]) {
        groupedMarks[key] = {
          testTitle: mark.testTitle,
          testDate: mark.testDate,
          students: []
        };
      }
      groupedMarks[key].students.push({
        studentId: mark.studentId._id,
        name: mark.studentId.name,
        marksObtained: mark.marksObtained,
        totalMarks: mark.totalMarks,
        remarks: mark.remarks
      });
    });

    res.json(Object.values(groupedMarks));
  } catch (err) {
    console.error("Error in getTeacherMarks:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
