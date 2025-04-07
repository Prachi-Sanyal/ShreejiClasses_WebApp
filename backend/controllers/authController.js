const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtp = require('../utils/sendOtp');
const validator = require('validator');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const generateToken = () => {
  return jwt.sign({ timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateToken2 = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateToken3 = (id, role, name) => {
  return jwt.sign({ userId: id, role, name }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); 
  return otp;
};

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePhoneNumber = (phoneNumber) => {
  return /^[0-9]{10}$/.test(phoneNumber);
};

const validatePassword = (password) => {
  return /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/.test(password);
};

const validateSubjects = (selectedCourse, subjects) => {
  const validSubjects = {
    'Grade 6-10': ['Maths', 'Science', 'English', 'Social Science'],
    'Grade 11-12 Science': ['Physics', 'Chemistry', 'Maths', 'Biology'],
    'JEE/NEET/GUJCET Preparation': ['Physics', 'Chemistry', 'Maths'],
    'SOF Olympiad': ['Maths', 'Science']
  };

  return subjects.every(subject => validSubjects[selectedCourse]?.includes(subject));
};

const signup = async (req, res) => {
  const { name, email, password, role, contactNumber, parentContactNumber, selectedCourse, studentClass, teachesClass, taughtCourses, teacherSubjects, subjects } = req.body;

  try {
    if (!name || !email || !password || !role || !contactNumber) {
      return res.status(400).json({ msg: 'Please fill all the required fields.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    if (!validatePhoneNumber(contactNumber)) {
      return res.status(400).json({ msg: 'Invalid contact number. Must be 10 digits.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long, and include at least 1 letter and 1 number.' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists.' });

    if (role === 'student') {
      if (!selectedCourse || !Array.isArray(selectedCourse) || selectedCourse.length === 0) {
        return res.status(400).json({ msg: 'selectedCourse is a required field and must be an array.' });
      }
      if (selectedCourse.includes('Grade 6-10') || selectedCourse.includes('Grade 11-12 Science')) {
        if (!studentClass) {
          return res.status(400).json({ msg: 'Class is required for students in selectedCourse.' });
        }
      }

      if (!parentContactNumber) {
        return res.status(400).json({ msg: 'parentContactNumber is required for students.' });
      }

      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ msg: 'Subjects are required for students.' });
      }

      if (!validateSubjects(selectedCourse, subjects)) {
        return res.status(400).json({ msg: 'Selected subjects do not match the selected course.' });
      }

      user = new User({
        name, email, password, role, contactNumber, parentContactNumber, selectedCourse, studentClass, subjects
      });
    }

    if (role === 'teacher') {
      if (!teachesClass || !Array.isArray(teachesClass) || teachesClass.length === 0) {
        return res.status(400).json({ msg: 'teachesClass is a required field and must be an array.' });
      }
      if (!taughtCourses || !Array.isArray(taughtCourses) || taughtCourses.length === 0) {
        return res.status(400).json({ msg: 'taughtCourses is a required field and must be an array.' });
      }

      if (!teacherSubjects || !Array.isArray(teacherSubjects) || teacherSubjects.length === 0) {
        return res.status(400).json({ msg: 'teacherSubjects is a required field and must be an array.' });
      }

      user = new User({
        name, email, password, role, contactNumber, teachesClass, taughtCourses, teacherSubjects
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const otp = generateOtp();
    user.otp = otp;

    const otpExpiryTime = parseInt(process.env.OTP_EXPIRY) || 300000;  
    user.otpExpires = new Date(Date.now() + otpExpiryTime);

    await user.save();

    await sendOtp(user.email, otp);

    res.status(200).json({ msg: 'OTP sent to email. Please verify.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP.' });
    if (user.otpExpires < Date.now()) return res.status(400).json({ msg: 'OTP expired.' });

    user.status = 'approved';
    await user.save();

    res.status(200).json({ msg: 'OTP verified. You are now approved.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please fill in both email and password.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: 'Invalid email format.' });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' });

    const token = generateToken3(user._id, user.role, user.name);

    res.status(200).json({ msg: 'Login successful.', token, role:user.role, name:user.name, email:user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};


const sendSignupLinks = async (req, res) => {
  const { emails, message } = req.body;

  try {
    if (!emails.trim || !message) {
      return res.status(400).json({ msg: 'Emails and message are required.' });
    }

    const emailList = typeof emails === 'string' ? emails.split(',') : [];

    if (emailList.length === 0) {
      return res.status(400).json({ msg: 'Invalid email format. Please provide a comma-separated list of emails.' });
    }

    emailList.forEach(async (email) => {
      const signupLink = `${process.env.FRONTEND_URL}/signup?token=${generateToken()}`;

      const finalMessage = `${message} \n\nSignup Link: ${signupLink}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Signup Link for Your Account',
        text: finalMessage,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error(`Error sending email to ${email}: ${err.message}`);
      }
    });

    res.status(200).json({ msg: 'Signup links sent successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = generateToken2({ userId: user._id });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: 'Reset password email sent.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params; 
  const { password } = req.body;

  const passwordRegex = /^(?=.*\d).{6,}$/; 
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long and contain at least one digit.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error(error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired.' });
    }

    res.status(400).json({ message: 'Invalid token.' });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found.' });

    const otp = generateOtp();
    const otpExpiryTime = parseInt(process.env.OTP_EXPIRY) || 300000; 
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + otpExpiryTime);

    await user.save();

    await sendOtp(user.email, otp);

    res.status(200).json({ msg: 'OTP resent to email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

{/*EDIT PROFILE */}

const editProfile = async (req, res) => {
  const { name, email, contactNumber, password, parentContactNumber } = req.body;
  const userId = req.params.userId; 

  try {
    const user = await User.findById(req.user.id); // 'req.user.id' should be set by authMiddleware
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    if (user.role === 'admin') {
      if (name) user.name = name;
      if (email) user.email = email;
      if (contactNumber) user.contactNumber = contactNumber;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    }

    if (user.role === 'teacher') {
      if (name) user.name = name;
      if (email) user.email = email;
      if (contactNumber) user.contactNumber = contactNumber;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    }

    if (user.role === 'student') {
      if (name) user.name = name;
      if (email) user.email = email;
      if (contactNumber) user.contactNumber = contactNumber;
      if (parentContactNumber) user.parentContactNumber = parentContactNumber;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    }

    await user.save();

    res.status(200).json({ msg: 'Profile updated successfully.', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.userId; 

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect.' });
    }

    if (newPassword.length < 6 || !/\d/.test(newPassword)) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters long and contain at least one digit.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ msg: 'Password updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Logged out successfully' });
};



module.exports = { signup, verifyOtp, login, sendSignupLinks, resendOtp, forgotPassword, resetPassword, editProfile, changePassword, profile, logout};
