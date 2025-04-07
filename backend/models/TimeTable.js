


const mongoose = require("mongoose");

const TimeTableSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: ["teacher", "student"], 
  },

  name: {
    type: String,
    required: function () {
      return this.userType === "teacher"; 
    },
  },

  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.userType === "teacher"; 
    },
  },

  selectedCourse: {
    type: String,
    required: function () {
      return this.userType === "student"; 
    },
  },

  studentClass: {
    type: String,
    required: function () {
      return this.userType === "student"; 
    },
  },

  timeTable: [
    {
      day: {
        type: String,
        required: true,
      },
      timeSlot: {
        type: String,
        required: true,
      },
      classAssigned: {
        type: String,
        required: function () {
          return this.userType === "teacher"; 
        },
      },
      subjects: {
        type: String,
        required: function () {
          return this.userType === "student"; 
        },
      },
    },
  ],
});

module.exports = mongoose.model("TimeTable", TimeTableSchema);
