const express = require("express");
const { getAllEvents, addEvent, deleteEvent } = require("../controllers/adminEventsController");

const router = express.Router();

router.get("/all", getAllEvents);
router.post("/add", addEvent);
router.delete("/delete/:date", deleteEvent);

module.exports = router;
