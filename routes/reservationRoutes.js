const express = require("express");
const Reservation = require("../db/models/reservation");
const seat = require("../db/models/seat");
const Showtime = require("../db/models/showtime");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create a reservation
router.post("/", authMiddleware, async (req, res) => {
    const { showtimeId, seatId } = req.body;

    // Validate input data
    if (
        !showtimeId ||
        !seatId ||
        isNaN(Number(showtimeId)) ||
        isNaN(Number(seatId))
    ) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    const transaction = await seat.sequelize.transaction(); //Start transaction
    try {
        // Checking that the seat is in the "available" state and locked
        const availableSeat = await seat.findOne({
            where: {
                id: seatId,
                showtimeId: showtimeId,
                status: "available",
            },
            lock: transaction.LOCK.UPDATE, // Locking seats to prevent simultaneous reservation
            transaction,
        });

        if (!availableSeat) {
            await transaction.rollback(); // Cancel transaction if space is unavailable
            return res
                .status(400)
                .json({ error: "Seat is not available for reservation" });
        }

        // Get relevant showtime information
        const showtime = await Showtime.findByPk(showtimeId);
        if (!showtime) {
            return res.status(404).json({ error: "Showtime not found" });
        }

        //Check if the current time is before the timeshow start time
        const currentTime = new Date();
        const showtimeDateTime = new Date(
            `${showtime.date}T${showtime.time}:00:00`
        );

        if (currentTime >= showtimeDateTime) {
            return res.status(400).json({
                error: "Cannot reservation after showtime has started",
            });
        }

        // Update seat status to "reserved"
        await seat.update(
            { status: "reserved" },
            { where: { id: seatId }, transaction }
        );

        // Create a new reservation
        const reservation = await Reservation.create(
            { userName: req.user.userName, showtimeId, seatId },
            { transaction }
        );

        await transaction.commit();

        res.status(201).json({
            message: "Seat successfully reserved",
            reservation,
        });
    } catch (error) {
        await transaction.rollback(); //In case of an error, we restore the database to its previous state.
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

// Cancel reservation
router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    // Validate input data
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        // Get reservation information
        const reservation = await Reservation.findByPk(id);
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        // Get relevant showtime information
        const showtime = await Showtime.findByPk(reservation.showtimeId);
        if (!showtime) {
            return res.status(404).json({ error: "Showtime not found" });
        }

        //Check if the current time is before the timeshow start time
        const currentTime = new Date();
        const showtimeDateTime = new Date(
            `${showtime.date}T${showtime.time}:00:00`
        );

        if (currentTime >= showtimeDateTime) {
            return res.status(400).json({
                error: "Cannot cancel reservation after showtime has started",
            });
        }

        delete reservation;
        await reservation.destroy();

        //Change seat status to "available"
        await seat.update(
            { status: "available" },
            { where: { id: reservation.seatId } }
        );

        res.json({
            message: "Reservation cancelled and seat is now available",
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
