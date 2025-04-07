const express = require("express");
const router = express.Router();
const { getAllTasks, addTask, deleteTask } = require("../controllers/teacherTasksController");

router.get("/all", getAllTasks);
router.post("/add", addTask);
router.delete("/delete/:id", deleteTask);

module.exports = router;
