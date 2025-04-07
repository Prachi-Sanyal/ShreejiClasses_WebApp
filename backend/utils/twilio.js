{/*
  require('dotenv').config({ path: '../.env' });  // Move one level up to backend folder
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


async function sendPerformanceSMS(phoneNumber, message) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phoneNumber
    });
    console.log(`📩 SMS sent to ${phoneNumber}`);
  } catch (err) {
    console.error("❌ Error sending SMS:", err);
  }
}

module.exports = { sendPerformanceSMS };
*/}