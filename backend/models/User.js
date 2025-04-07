const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: [validator.isEmail, 'Please provide a valid email address.'] 
  },

  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password must be at least 6 characters long.'],
    validate: {
      validator: function(value) {
        return /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/.test(value); 
      },
      message: 'Password must contain at least 1 letter and 1 number.'
    }
  },

  role: { 
    type: String, 
    enum: ['admin', 'student', 'teacher'], 
    required: true 
  },

  contactNumber: { 
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^[0-9]{10}$/.test(value); 
      },
      message: 'Phone number must be 10 digits.'
    }
  },

  otp: { type: String }, 
  otpExpires: { type: Date }, 

  signupToken: { type: String },
  signupTokenExpires: { type: Date },

  parentContactNumber: {
    type: String,
    validate: {
      validator: function(value) {
        return /^[0-9]{10}$/.test(value);
      },
      message: 'Parent phone number must be 10 digits.'
    },
    required: function() { return this.role === 'student'; }
  },

  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },

  studentClass: { 
    type: [String], 
    enum: ['6', '7', '8', '9', '10', '11', '12', 'Others'],
    required: function() { return this.role === 'student'; } 
  },

  selectedCourse: [{
    type: String,
    enum: ['Grade 6-10', 'Grade 11-12 Science', 'JEE/NEET/GUJCET Preparation', 'SOF Olympiad'],
    required: function() { return this.role === 'student'; }
  }],

  subjects: [{
    type: String,
    required: function() {
      return this.selectedCourse && this.selectedCourse.length > 0;
    },
    validate: {
      validator: function(subject) {
        const validSubjects = {
          'Grade 6-10': ['Maths', 'Science', 'English', 'Social Science'],
          'Grade 11-12 Science': ['Physics', 'Chemistry', 'Maths', 'Biology'],
          'JEE/NEET/GUJCET Preparation': ['Physics', 'Chemistry', 'Maths'],
          'SOF Olympiad': ['Maths', 'Science']
        };
        return validSubjects[this.selectedCourse]?.includes(subject);
      },
      message: props => `${props.value} is not a valid subject for the selected course.`
    }
  }],

  teachesClass: [{ 
    type: String, 
    enum: ['6', '7', '8', '9', '10', '11', '12', 'GUJCET/NEET/JEE Preparation', 'SOF Olympiad Preparation'],
    required: function() { return this.role === 'teacher'; }
  }],

  taughtCourses: [{
    course: {
      type: String,  
      enum: ['Grade 6-10', 'Grade 11-12 Science', 'JEE/NEET/GUJCET Preparation', 'SOF Olympiad Preparation'],
      required: function() { return this.role === 'teacher'; }
    },
    subjects: {
      type: [String],
      validate: {
        validator: function(subjects) {
          const validSubjects = {
            'Grade 6-10': ['Maths', 'Science', 'English', 'Social Science'],
            'Grade 11-12 Science': ['Physics', 'Chemistry', 'Maths', 'Biology'],
            'JEE/NEET/GUJCET Preparation': ['Physics', 'Chemistry', 'Maths'],
            'SOF Olympiad Preparation': ['Maths', 'Science']
          };
          return subjects.every(subject => validSubjects[this.course]?.includes(subject));
        },
        message: props => `${props.value} is not a valid subject for the selected course.`
      }
    }
  }],

  teacherSubjects: [{
    subject: {
      type: String,  
      enum: ['Maths', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry', 'Biology'],
      required: function() { return this.role === 'teacher'; }
    }
  }]
});

UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.clearOtp = function() {
  this.otp = undefined;
  this.otpExpires = undefined;
};

module.exports = mongoose.model('User', UserSchema);
