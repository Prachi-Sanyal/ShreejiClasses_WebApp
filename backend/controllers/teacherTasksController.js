const TeacherTask = require("../models/teacherTasks");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await TeacherTask.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { task } = req.body;
    const newTask = new TeacherTask({ task });
    await newTask.save();
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await TeacherTask.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
