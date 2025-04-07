const express = require("express");
const { addOrUpdateEvent, getAllEvents, deleteEvent } = require("../controllers/studentEventsController");

const router = express.Router();

// Add or Update an Event Note
router.post("/add", addOrUpdateEvent);

// Get All Events
router.get("/all", getAllEvents);

// Delete an Event Note
router.delete("/delete/:date", deleteEvent);

module.exports = router;
