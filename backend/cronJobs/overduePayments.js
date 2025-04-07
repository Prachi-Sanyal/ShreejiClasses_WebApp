const cron = require("node-cron");
const { updateOverduePayments } = require("../controllers/feeController");

cron.schedule("*/1 * * * *", async () => {
    console.log("Running overdue payment update job...");
    await updateOverduePayments();
  });
  

{/*
cron.schedule("0 0 * * *", async () => {
  console.log("Running overdue payment update job...");
  await updateOverduePayments();
});
*/}
