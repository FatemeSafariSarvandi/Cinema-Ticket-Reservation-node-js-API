const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getListOfSeats,
    createSeats,
    deleteSeats,
} = require("../controllers/seatController");
const router = express.Router();

//Get a list of seats for a specific showtime
router.get("/showtime/:showtimeId", getListOfSeats);

//create seats for specific showtime
router.post("/", authMiddleware, createSeats);

// delete all seats for specific showtime
router.delete("/showtime/:id", authMiddleware, deleteSeats);

module.exports = router;
