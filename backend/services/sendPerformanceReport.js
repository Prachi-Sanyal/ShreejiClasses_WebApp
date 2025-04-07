const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const twilio = require("twilio");
const exceljs = require("exceljs");
const Marks = require("../models/Marks");
const User = require("../models/User");

// ✅ Twilio Configuration
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// ✅ Google Drive Configuration
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// ✅ Function to Generate Excel Report
const generateExcelReport = async (student, marksRecords) => {
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Performance Report");

  // ✅ Define Columns
  worksheet.columns = [
    { header: "Date", key: "testDate", width: 15 },
    { header: "Subject", key: "subject", width: 20 },
    { header: "Total Marks", key: "totalMarks", width: 15 },
    { header: "Marks Obtained", key: "marksObtained", width: 15 },
    { header: "Percentage", key: "percentage", width: 12 },
  ];

  // ✅ Add Data Rows
  marksRecords.forEach((record) => {
    worksheet.addRow({
      testDate: new Date(record.testDate).toLocaleDateString(),
      subject: record.subject,
      totalMarks: record.totalMarks,
      marksObtained: record.marksObtained,
      percentage: ((record.marksObtained / record.totalMarks) * 100).toFixed(2) + "%",
    });
  });

  // ✅ Save File Temporarily
  const filePath = path.join(__dirname, `../reports/${student.name}_Performance_Report.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};

// ✅ Function to Upload File to Google Drive
const uploadFileToDrive = async (filePath, studentName) => {
  const fileMetadata = {
    name: `${studentName}_Performance_Report.xlsx`,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Folder where files will be uploaded
  };

  const media = {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });

  return `https://drive.google.com/file/d/${response.data.id}/view`;
};

// ✅ Function to Send Performance Report via SMS
const sendPerformanceReport = async () => {
  try {
    const students = await User.find({ role: "student" });

    for (let student of students) {
      // ✅ Get Last Month's Data
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const marksRecords = await Marks.find({
        studentId: student._id,
        testDate: {
          $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      });

      if (marksRecords.length === 0) continue; // Skip if no marks available

      // ✅ Generate Excel Report
      const filePath = await generateExcelReport(student, marksRecords);

      // ✅ Upload to Google Drive
      const driveLink = await uploadFileToDrive(filePath, student.name);

      // ✅ Generate SMS Message
      const message = `Dear Parent, your child's performance report for last month is ready. View here: ${driveLink}`;

      // ✅ Send SMS to Parent
      if (student.parentContactNumber) {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: student.parentContactNumber,
        });
      }

      // ✅ Delete Local File After Upload
      fs.unlinkSync(filePath);
    }

    console.log("Performance SMS sent successfully.");
  } catch (err) {
    console.error("Error sending performance report:", err);
  }
};

module.exports = sendPerformanceReport;
