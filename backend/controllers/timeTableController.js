const TimeTable = require("../models/TimeTable");
const User = require("../models/User");








exports.uploadTimeTable = async (req, res) => {
  try {
    const { userType, name, selectedCourse, studentClass, timeTable } = req.body;

    if (!userType || !timeTable) {
      return res.status(400).json({ message: "User type and timetable are required" });
    }

    if (userType === "teacher") {
      if (!name) {
        return res.status(400).json({ message: "Teacher name is required" });
      }

      let existingTeacher = await User.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") }, 
        role: "teacher" 
      });

      if (!existingTeacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      let newTimeTable = new TimeTable({
        userType,
        teacherId: existingTeacher._id, 
        name: existingTeacher.name, 
        timeTable, 
      });

      await newTimeTable.save();
      return res.status(201).json({ message: "Teacher timetable uploaded successfully" });

    } else if (userType === "student") {
      if (!selectedCourse || !studentClass) {
        return res.status(400).json({ message: "Selected course and student class are required" });
      }

      let newTimeTable = new TimeTable({
        userType,
        selectedCourse,
        studentClass,
        timeTable,
      });

      await newTimeTable.save();
      return res.status(201).json({ message: "Student timetable uploaded successfully" });

    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};









exports.getTimeTable = async (req, res) => {
  try {

    const { role, name, selectedCourse, studentClass } = req.user; 
    const userType = role; 
    if (!userType) {
      return res.status(400).json({ message: "User type is missing in request" });
    }

    let timeTable;

    if (userType === "teacher") {
      timeTable = await TimeTable.findOne({ name, userType: "teacher" });
    } else if (userType === "student") {
      timeTable = await TimeTable.findOne({ selectedCourse, studentClass, userType: "student" });
    } else {
      return res.status(400).json({ message: `Invalid user type: ${userType}` });
    }

    if (!timeTable) {
      return res.status(404).json({ message: "No timetable found" });
    }

    res.status(200).json(timeTable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTimeTables = async (req, res) => {
  try {
    const timeTables = await TimeTable.find();
    if (!timeTables.length) {
      return res.status(404).json({ message: "No timetables found" });
    }
    res.status(200).json(timeTables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTimeTable = async (req, res) => {
  try {
    const { timeTableId } = req.params;
    const updateData = req.body;

    let updatedTimeTable = await TimeTable.findByIdAndUpdate(timeTableId, updateData, { new: true });
    if (!updatedTimeTable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.status(200).json({ message: "Timetable updated successfully", updatedTimeTable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTimeTable = async (req, res) => {
  try {
    const { timeTableId } = req.params;

    let deletedTimeTable = await TimeTable.findByIdAndDelete(timeTableId);
    if (!deletedTimeTable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.status(200).json({ message: "Timetable deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
