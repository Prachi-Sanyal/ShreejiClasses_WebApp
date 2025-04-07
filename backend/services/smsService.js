const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (phoneNumbers, message) => {
  try {
    for (const number of phoneNumbers) {
      await client.messages.create({
        body: `Shreeji Classes: ${message}`,
        from: process.env.TWILIO_PHONE, 
        to: number
      });
    }
    console.log('Messages sent successfully.');
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};

module.exports = { sendSMS };
