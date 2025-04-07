const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  updateTaskProgress,
  deleteTask,
} = require("../controllers/adminTaskController");

router.get("/", getTasks);
router.post("/", addTask);
router.put("/:taskId", updateTaskProgress);
router.delete("/:taskId", deleteTask);

module.exports = router;
