const cron = require("node-cron");
const sendAttendanceReport = require("../services/sendAttendanceSMS");

cron.schedule("* * * * *", () => {  
  console.log('Cron job triggered to generate attendance sms.');

  sendAttendanceReport();
});

{/*


cron.schedule("0 10 1 * *", () => {  
  sendAttendanceReport();
});


*/}


