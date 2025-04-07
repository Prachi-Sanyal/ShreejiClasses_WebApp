const cron = require('node-cron');
const twilio = require('twilio');
const Payment = require('../models/Payment');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

// Twilio setup
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS reminders
const sendSMSReminder = async () => {
    try {
        // Get today's date and calculate the date 2 days from now
        const today = new Date();
        const twoDaysFromNow = new Date(today.setDate(today.getDate() + 2));

        // Log TWILIO credentials for debugging purposes
        console.log('TWILIO_SID:', process.env.TWILIO_SID);
        console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
        console.log('TWILIO_PHONE:', process.env.TWILIO_PHONE);

        // Find payments with due date exactly 2 days from now and that are not marked as 'completed'
        const paymentsDueSoon = await Payment.find({
            dueDate: {
                $gte: twoDaysFromNow.setHours(0, 0, 0, 0), // Start of the day (midnight)
                $lt: twoDaysFromNow.setHours(23, 59, 59, 999), // End of the day (just before midnight)
            },
            status: { $ne: 'completed' } // Exclude completed payments
        });

        if (paymentsDueSoon.length === 0) {
            console.log('No payments due in 2 days.');
        }

        // Loop through all payments and send SMS to each user's parent contact
        for (const payment of paymentsDueSoon) {
            const user = await User.findById(payment.userId); // Assuming 'userId' is stored in Payment model

            if (user && user.parentContactNumber) {
                const message = `Reminder: Your installment payment for student ${user.name} is due in 2 days. Please ensure timely payment to avoid any penalties.`;

                // Send SMS to the parent's contact number
                console.log('Sending message to:', user.parentContactNumber);

                try {
                    await client.messages.create({
                        body: message,
                        from: process.env.TWILIO_PHONE, // Twilio phone number
                        to: user.parentContactNumber, // Parent's contact number
                    });
                    console.log(`Reminder sent to ${user.parentContactNumber}`);
                } catch (error) {
                    console.error('Error sending SMS:', error);
                }
            } else {
                console.error('User or parent contact number not found for payment ID:', payment._id);
            }
        }
    } catch (error) {
        console.error('Error in sending SMS:', error);
    }
};

// Trigger the function manually to test
sendSMSReminder(); 

// Schedule cron job to run daily at midnight
cron.schedule('0 0 * * *', sendSMSReminder);

console.log('Cron job scheduled to run daily at midnight...');




{/*
    const cron = require('node-cron');
const twilio = require('twilio');
const Payment = require('../models/Payment');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

// Twilio setup
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS reminders
const sendSMSReminder = async () => {
    try {

        console.log('TWILIO_SID:', process.env.TWILIO_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE:', process.env.TWILIO_PHONE);

        // TEST CASE: Use this block to test with a hardcoded user (remove after testing)
        const testUser = {
            name: "Test Student",
            parentContactNumber: "+917490882159", // Replace with a valid phone number
        };

        const testMessage = `Reminder: Your installment payment for student ${testUser.name} is due in 2 days. Please ensure timely payment to avoid any penalties.`;

        console.log('Sending test message to:', testUser.parentContactNumber);

        // Send SMS to the test user
        client.messages.create({
            body: testMessage,
            from: process.env.TWILIO_PHONE, // Twilio phone number
            to: testUser.parentContactNumber, // Parent's contact number
        })
        .then((message) => {
            console.log("Test SMS sent:", message.sid);
        })
        .catch((error) => {
            console.error("Error sending test SMS:", error);
        });

    } catch (error) {
        console.error('Error in sending SMS:', error);
    }
};

// Trigger the function manually to test
sendSMSReminder(); 

// Schedule cron job to run daily at midnight
cron.schedule('0 0 * * *', sendSMSReminder);

console.log('Cron job scheduled to run daily at midnight...');
*/}
