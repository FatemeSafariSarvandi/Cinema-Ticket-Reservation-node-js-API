const express = require("express");
const showtime = require("../db/models/showtime");
const authMiddleware = require("../middleware/authMiddleware");
const dayjs = require("dayjs");

const router = express.Router();

// Get movie showtimes
router.get("/:movieId", async (req, res, next) => {
    const { movieId } = req.params;
    if (!movieId || isNaN(Number(movieId))) {
        return res
            .status(400)
            .json({ error: "Invalid movieId. It must be a valid number." });
    }

    try {
        const showtimes = await showtime.findAll({
            where: { movieId: movieId },
        });
        if (!showtimes || showtimes.length === 0) {
            return res
                .status(404)
                .json({ error: "No showtimes found for the given movieId." });
        }
        res.json(showtimes);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Get movie showtimes by time
router.get("/time/:time", async (req, res, next) => {
    const { time } = req.params;
    if (!time || isNaN(Number(time))) {
        return res
            .status(400)
            .json({ error: "Invalid time. It must be a valid number." });
    }

    try {
        const showtimes = await showtime.findAll({
            where: { time: time },
        });
        if (!showtimes || showtimes.length === 0) {
            return res
                .status(404)
                .json({ error: "No showtimes found for the given time." });
        }
        res.json(showtimes);
    } catch (error) {
        next(error);
    }
});

// Get movie showtimes by date
router.get("/date/:date", async (req, res, next) => {
    try {
        const showtimes = await showtime.findAll({
            where: { date: req.params.date },
        });
        if (!showtimes || showtimes.length === 0) {
            return res
                .status(404)
                .json({ error: "No showtimes found for the given date." });
        }
        res.json(showtimes);
    } catch (error) {
        next(error);
    }
});

//Add a showtime (admin only)
router.post("/", authMiddleware, async (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { movieId, date, time } = req.body;

    // Validate input data
    if (
        !movieId ||
        !date ||
        !time ||
        isNaN(Number(movieId)) ||
        isNaN(Number(time))
    ) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        //! When using `new Date` instead of the time value, it returns `invalid`, so I had to use `dayjs`.
        // const showtimeDateTime = new Date(`${date}T${time}:00:00`);
        const showtimeDateTime = dayjs(`${date}T${time}:00:00`).toDate();
        const currentTime = new Date();
        if (currentTime >= showtimeDateTime) {
            return res.status(400).json({
                error: "Cannot create showtime before current time",
            });
        }

        const existingShowtime = await showtime.findOne({
            where: { date, time },
        });

        if (existingShowtime) {
            return res.status(400).json({
                error: "Another movie is already scheduled at this time.",
            });
        }

        const newShowtime = await showtime.create({ movieId, date, time });
        res.status(201).json(newShowtime);
    } catch (error) {
        next(error);
    }
});

// Delete showtime (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { id } = req.params;

    // Validate input data
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const deletedshowtime = await showtime.findByPk(id);
        if (!deletedshowtime)
            return res.status(404).json({ error: "showtime not found" });

        await deletedshowtime.destroy();
        res.json({ message: "The showtime was successfully deleted." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
