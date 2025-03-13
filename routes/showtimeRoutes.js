const express = require("express");
const showtime = require("../db/models/showtime");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get movie showtimes
router.get("/:movieId", async (req, res) => {
    const showtimes = await showtime.findAll({
        where: { movieId: req.params.movieId },
    });
    res.json(showtimes);
});

// Get movie showtimes by time
router.get("/time/:time", async (req, res) => {
    const showtimes = await showtime.findAll({
        where: { time: req.params.time },
    });
    res.json(showtimes);
});

// Get movie showtimes by date
router.get("/date/:date", async (req, res) => {
    const showtimes = await showtime.findAll({
        where: { date: req.params.date },
    });
    res.json(showtimes);
});

//Add a showtime (admin only)
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { movieId, date, time } = req.body;
    try {
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
        res.status(400).json({ error: error.message });
    }
});

// Delete showtime (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const deletedshowtime = await showtime.findByPk(req.params.id);
    if (!deletedshowtime)
        return res.status(404).json({ error: "showtime not found" });

    await deletedshowtime.destroy();
    res.json({ message: "The showtime was successfully deleted." });
});

module.exports = router;
