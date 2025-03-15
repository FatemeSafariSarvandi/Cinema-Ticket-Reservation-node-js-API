const seat = require("../db/models/seat");

//Get a list of seats for a specific showtime
const getListOfSeats = async (req, res) => {
    const { showtimeId } = req.params;
    // Validate input data
    if (!showtimeId || isNaN(Number(showtimeId))) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const seats = await seat.findAll({ where: { showtimeId } });

        if (seats.length === 0) {
            return res
                .status(404)
                .json({ message: "No seats found for this showtime" });
        }

        res.json(seats);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

//create seats
const createSeats = async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { showtimeId, seatNumber } = req.body;
    // Validate input data
    if (
        !showtimeId ||
        !seatNumber ||
        isNaN(Number(showtimeId)) ||
        isNaN(Number(seatNumber))
    ) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const showtimeSeats = await seat.findAll({
            where: { showtimeId: showtimeId },
        });
        if (showtimeSeats.length !== 0) {
            return res.status(400).json({
                error: "Seats have already been created for this showtime.",
            });
        }

        //! The number of seats in the cinema is fixed, but for ease of use with the API, we get the number of seats in req.
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
        res.status(500).json({ error: "Internal server error" });
    }
};

// delete all seats for specific showtime
const deleteSeats = async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { id } = req.params;
    // Validate input data
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const seats = await seat.findAll({
            where: { showtimeId: id },
        });
        if (seats.length === 0)
            return res.status(404).json({ error: "showtimeId not found" });

        await seat.destroy({ where: { showtimeId: id } });
        res.json({ message: "seats were successfully deleted." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { getListOfSeats, createSeats, deleteSeats };
