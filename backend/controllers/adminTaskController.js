const AdminTask = require("../models/adminTask");

// 🟢 Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await AdminTask.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// 🟢 Add new task
exports.addTask = async (req, res) => {
  try {
    const { task, deadline } = req.body;
    const newTask = new AdminTask({ task, deadline, progress: 0 });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add task" });
  }
};

// 🟢 Update task progress
exports.updateTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await AdminTask.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.progress = Math.min(task.progress + 20, 100);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task progress" });
  }
};

// 🟢 Delete task
exports.deleteTask = async (req, res) => {
  try {
    await AdminTask.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
