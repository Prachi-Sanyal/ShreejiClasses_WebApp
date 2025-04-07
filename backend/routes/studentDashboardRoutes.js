const express = require("express");
const { getMonthlyDashboardData } = require("../controllers/studentDashboardData");
const  {authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/student-dashboard", authMiddleware, getMonthlyDashboardData);

module.exports = router;
