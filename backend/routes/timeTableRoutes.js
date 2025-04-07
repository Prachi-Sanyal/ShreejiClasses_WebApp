const express = require("express");
const { uploadTimeTable, getTimeTable, getAllTimeTables, updateTimeTable, deleteTimeTable } = require("../controllers/timeTableController");
const router = express.Router();
const {authMiddleware}= require("../middlewares/authMiddleware");

router.post("/upload", uploadTimeTable);

router.get("/getTimeTable", authMiddleware, getTimeTable);



router.get("/getAllTimeTables", getAllTimeTables);

router.put("/updateTimeTable/:timeTableId", updateTimeTable);

router.delete("/deleteTimeTable/:timeTableId", deleteTimeTable);
module.exports = router;
