const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtp = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendOtp;
