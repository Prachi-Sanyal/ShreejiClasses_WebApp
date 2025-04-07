const Attendance = require("../models/Attendance");
const User = require("../models/User");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendAttendanceReport = async () => {
  try {
    console.log("Fetching students from the database...");
    const students = await User.find({ role: "student" });
    console.log(`Found ${students.length} students.`);

    const currentMonth = new Date().getMonth(); // Get current month (0-indexed)
    const currentYear = new Date().getFullYear(); // Get current year

    for (let student of students) {
      console.log(`Fetching attendance for student: ${student._id}`);
      
      // Filter attendance records for the current month and year
      const attendanceRecords = await Attendance.find({
        studentId: student._id,
        date: {
          $gte: new Date(currentYear, currentMonth, 1), // Start of the current month
          $lt: new Date(currentYear, currentMonth + 1, 0), // End of the current month
        },
      });

      console.log(`Found ${attendanceRecords.length} attendance records for student: ${student._id}`);

      const presentDays = attendanceRecords.filter(a => a.status === "Present").length;
      const totalDays = attendanceRecords.length;

      // Construct the message
      const message = `Dear Parent, your child ${student.name} attended ${presentDays}/${totalDays} days this month.`;

      if (student.parentContactNumber) {
        const parentContactNumber = `+91${student.parentContactNumber.replace(/^0/, '')}`;

        console.log(`Sending SMS to parent: ${parentContactNumber}`);
        
        const smsResponse = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: parentContactNumber,
        });

        console.log(`SMS sent to ${parentContactNumber}: ${smsResponse.sid}`);
      } else {
        console.log(`No parent contact number found for student: ${student._id}`);
      }
    }

  } catch (err) {
    console.error("Error in sendAttendanceReport:", err);
  }
};

module.exports = sendAttendanceReport;






{/* working perfect -------------------------------

const Attendance = require("../models/Attendance");
const User = require("../models/User");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendAttendanceReport = async () => {
  try {
    console.log("Fetching students from the database...");
    const students = await User.find({ role: "student" });
    console.log(`Found ${students.length} students.`);

    for (let student of students) {
      console.log(`Fetching attendance for student: ${student._id}`);
      
      const attendanceRecords = await Attendance.find({ studentId: student._id });
      console.log(`Found ${attendanceRecords.length} attendance records for student: ${student._id}`);

      const presentDays = attendanceRecords.filter(a => a.status === "Present").length;
      const totalDays = attendanceRecords.length;

      const message = `Dear Parent, your child attended ${presentDays}/${totalDays} days this month.`;

      if (student.parentContactNumber) {
        const parentContactNumber = `+91${student.parentContactNumber.replace(/^0/, '')}`;

        console.log(`Sending SMS to parent: ${student.parentContactNumber}`);
        
        const smsResponse = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: parentContactNumber,
        });

        console.log(`SMS sent to ${student.parentContactNumber}: ${smsResponse.sid}`);
      } else {
        console.log(`No parent contact number found for student: ${student._id}`);
      }
    }

  } catch (err) {
    console.error("Error in sendAttendanceReport:", err);
  }
};

module.exports = sendAttendanceReport;



*/}






{/*
  
  const Attendance = require("../models/Attendance");
const User = require("../models/User");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const sendAttendanceReport = async () => {
  try {
    const students = await User.find({ role: "student" });

    for (let student of students) {
      const attendanceRecords = await Attendance.find({ studentId: student._id });

      const presentDays = attendanceRecords.filter(a => a.status === "Present").length;
      const totalDays = attendanceRecords.length;

      const message = `Dear Parent, your child attended ${presentDays}/${totalDays} days this month.`;

      if (student.parentPhone) {
        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: student.parentContactNumber,
        });  console.log('SMS sent successfully to:', student.parentContactNumber);

      }


    }
  } catch (err) {
    console.error("Error sending SMS:", err);
  }
};

module.exports = sendAttendanceReport;
*/}