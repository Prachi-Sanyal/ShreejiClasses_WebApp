{/*
  const cron = require("node-cron");
const { generatePerformanceReport } = require('../controllers/marksController'); // Adjust the path as needed
const { sendPerformanceReportSMS } = require('../controllers/marksController'); // Adjust the path as needed
const moment = require('moment'); // To handle current date

// Every 1st of the month at 12:05 AM
cron.schedule("* * * * *", async () => {
  try {
    console.log("⏳ Running monthly performance report generation...");

    // Get last month's data
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    console.log(`📅 Generating report for ${lastMonth}/${year}`);

    // Generate reports (direct function call without req, res)
    const reportResponse = await generatePerformanceReport(lastMonth, year);

    if (reportResponse.reports.length === 0) {
      console.log("❌ No reports generated for last month.");
      return;
    }

    console.log(`✅ ${reportResponse.reports.length} reports generated.`);

    // Send SMS with report links
    await sendPerformanceReportSMS(reportResponse.reports);

    console.log("📩 Performance report SMS sent successfully.");
  } catch (error) {
    console.error("🔴 Error in scheduled task:", error);
  }
});
*/}