const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getShowtimes,
    getShowtimeByTime,
    getShowtimeByDate,
    addShowtime,
    deleteShowTime,
} = require("../controllers/showtimeController");

const router = express.Router();

// Get movie showtimes
router.get("/:movieId", getShowtimes);

// Get movie showtimes by time
router.get("/time/:time", getShowtimeByTime);

// Get movie showtimes by date
router.get("/date/:date", getShowtimeByDate);

//Add a showtime (admin only)
router.post("/", authMiddleware, addShowtime);

// Delete showtime (Admin Only)
router.delete("/:id", authMiddleware, deleteShowTime);

module.exports = router;
