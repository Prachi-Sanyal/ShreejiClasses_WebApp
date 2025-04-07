{/*
  const cron = require('node-cron');
const { generatePerformanceReport } = require('../controllers/marksController'); // Adjust the path as needed
const { sendPerformanceReportSMS } = require('../controllers/marksController'); // Adjust the path as needed
const moment = require('moment'); // To handle current date


const { sendPerformanceSMS } = require("../utils/twilio"); // Required for sending SMS
const { uploadToGoogleDrive, generateDriveLink } = require("../utils/googleDrive"); // Required if Drive upload is used
const { generateBarChart, generateLineChart } = require("../utils/generateCharts"); // Required if charts are generated

cron.schedule('* * * * *', async () => {
  console.log('Cron job triggered to generate and send performance reports at the end of the month.');

  try {
      const currentMonth = moment().format('M'); // Current month as number (1-12)
      const currentYear = moment().format('YYYY'); // Current year
      console.log(`Current Month: ${currentMonth}, Current Year: ${currentYear}`);

      // Mock request and response objects
      const mockReq = {
          query: {
              month: currentMonth,
              year: currentYear
          }
      };

      // Mock response object (Updated)
      const mockRes = {
          statusCode: 200, // Default status
          jsonData: null, // Store response data

          status: function (statusCode) {
              this.statusCode = statusCode;
              return this;
          },
          json: function (data) {
              console.log(`Response Status: ${this.statusCode}, Response Data:`, data);
              this.jsonData = data; // Store the response data
              return this.jsonData; // Return data to be used in cron logic
          }
      };

      // Generate performance report for the current month and year
      const reportResponse = await generatePerformanceReport(mockReq, mockRes);
      console.log("🚀 Raw report response:", reportResponse); // Add this log

      // ✅ Use the stored response data properly
      if (reportResponse && reportResponse.reports && reportResponse.reports.length > 0) {
          console.log('Reports generated successfully:', reportResponse.reports.length, 'reports found.');

          console.log("🔵 Calling sendPerformanceReportSMS function...");

          // Send SMS to parents with performance reports
          await sendPerformanceReportSMS({
              body: { reports: reportResponse.reports }
          });

          console.log("✅ Performance report SMS sent to parents successfully.");
      } else {
          console.log('❌ No reports generated for the current month.');
      }

  } catch (err) {
      console.error("❌ Error executing monthly tasks:", err);
  }
});



    
// 📅 Schedule task to run at the end of every month at 11:59 PM
cron.schedule('* * * * *', async () => {
  console.log('Cron job triggered to generate and send performance reports at the end of the month.');

  try {
    // Get current month and year (e.g., April 2025)
    const currentMonth = moment().format('M'); // Current month as number (1-12)
    const currentYear = moment().format('YYYY'); // Current year
    console.log(`Current Month: ${currentMonth}, Current Year: ${currentYear}`);

    // Generate performance report for the current month and year
    const reportResponse = await generatePerformanceReport({ 
      query: { month: currentMonth, year: currentYear }
    });

    if (reportResponse && reportResponse.reports && reportResponse.reports.length) {
      console.log('Reports generated successfully:', reportResponse.reports.length, 'reports found.');

      // Send SMS to parents with performance reports
      await sendPerformanceReportSMS({
        body: { reports: reportResponse.reports }
      });
      console.log("Performance report SMS sent to parents successfully.");
    } else {
      console.log('No reports generated for the current month.');
    }

  } catch (err) {
    console.error("Error executing monthly tasks:", err);
  }
});

console.log('Monthly tasks are scheduled...');

*/}