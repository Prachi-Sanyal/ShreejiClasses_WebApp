const express = require("express");
const router = express.Router();
const { getAllEvents, addEvent, deleteEvent } = require("../controllers/teacherEventsController");

router.get("/all", getAllEvents);
router.post("/add", addEvent);
router.delete("/delete/:date", deleteEvent);

module.exports = router;
