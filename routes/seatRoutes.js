const express = require("express");
const seat = require("../db/models/seat");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//Get a list of seats for a specific showtime
router.get("/showtime/:showtimeId", async (req, res) => {
    try {
        const { showtimeId } = req.params;
        const seats = await seat.findAll({ where: { showtimeId } });

        if (seats.length === 0) {
            return res
                .status(404)
                .json({ message: "No seats found for this showtime" });
        }

        res.json(seats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//update seat
// router.put("/:id", async (req, res) => {
//     const { id } = req.params;
//     const transaction = await seat.sequelize.transaction();

//     try {
//         // بررسی وضعیت صندلی و قفل کردن آن
//         const availableSeat = await seat.findOne({
//             where: { id, status: "available" },
//             lock: transaction.LOCK.UPDATE,
//             transaction,
//         });

//         if (!availableSeat) {
//             await transaction.rollback();
//             return res
//                 .status(400)
//                 .json({ error: "Seat is not available for reservation" });
//         }

//         await seat.update(
//             { status: "reserved" },
//             { where: { id }, transaction }
//         );

//         await transaction.commit();

//         res.json({ message: "Seat successfully reserved", seat });
//     } catch (error) {
//         await transaction.rollback();
//         res.status(500).json({ error: error.message });
//     }
// });

//create seats for specific showtime
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { showtimeId, seatNumber } = req.body;

    try {
        const seats = [];
        var newseatNumber = 100;
        if (seatNumber < 100) newseatNumber = seatNumber;
        for (let i = 1; i <= newseatNumber; i++) {
            seats.push({ showtimeId: showtimeId, seatNumber: i });
        }
        await seat.bulkCreate(seats);

        res.status(201).json({
            message: `Showtime created with ${newseatNumber} seats`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//add seat to specific showtime

// delete all seats for specific showtime
router.delete("/showtime/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });
    try {
        const seats = await seat.findAll({
            where: { showtimeId: req.params.id },
        });
        if (seats.length === 0)
            return res.status(404).json({ error: "showtimeId not found" });

        await seat.destroy({ where: { showtimeId: req.params.id } });
        res.json({ message: "seats were successfully deleted." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Removing specific seats for specific showtimes
// router.delete("/:id", authMiddleware, async (req, res) => {
//     if (req.user.role !== "admin")
//         return res.status(403).json({ error: "Unauthorized" });
//     try {
//         const deletedSeat = await seat.findByPk(req.params.id);
//         if (!deletedSeat)
//             return res.status(404).json({ error: "seat not found" });

//         await deletedSeat.destroy();
//         res.json({ message: "The seat was successfully deleted." });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;
