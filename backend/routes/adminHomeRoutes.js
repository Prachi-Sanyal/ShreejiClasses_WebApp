const express = require("express");
const { getDashboardStats } = require("../controllers/adminHomeController");

const router = express.Router();

// Define route to get dashboard stats
router.get("/dashboard-stats", getDashboardStats);

module.exports = router;
