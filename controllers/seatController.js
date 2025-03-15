const seat = require("../db/models/seat");
const AppError = require("../utilities/appError");
const { tryCatchHandler } = require("../utilities/tryCatchHandler");

//Get a list of seats for a specific showtime
const getListOfSeats = tryCatchHandler(async (req, res) => {
    const { showtimeId } = req.params;
    // Validate input data
    if (!showtimeId || isNaN(Number(showtimeId))) {
        throw new AppError("INVALID_INPUT", "Invalid input data", 400);
    }

    const seats = await seat.findAll({ where: { showtimeId } });

    if (seats.length === 0) {
        throw new AppError(
            "SEAT_NOT_FOUND",
            "No seats found for this showtime",
            404
        );
    }

    res.status(200).json(seats);
});

//create seats
const createSeats = tryCatchHandler(async (req, res) => {
    if (req.user.role !== "admin")
        throw new AppError("UNAUTHORIZED", "Unauthorized", 403);

    const { showtimeId, seatNumber } = req.body;
    // Validate input data
    if (
        !showtimeId ||
        !seatNumber ||
        isNaN(Number(showtimeId)) ||
        isNaN(Number(seatNumber))
    ) {
        throw new AppError("INVALID_INPUT", "Invalid input data", 400);
    }

    const showtimeSeats = await seat.findAll({
        where: { showtimeId: showtimeId },
    });
    if (showtimeSeats.length !== 0) {
        throw new AppError(
            "SEAT_CONFLICT",
            "Seats have already been created for this showtime.",
            409
        );
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
});

// delete all seats for specific showtime
const deleteSeats = tryCatchHandler(async (req, res) => {
    if (req.user.role !== "admin")
        throw new AppError("UNAUTHORIZED", "Unauthorized", 403);

    const { id } = req.params;
    // Validate input data
    if (!id || isNaN(Number(id))) {
        throw new AppError("INVALID_ID", "Invalid id", 400);
    }

    const seats = await seat.findAll({
        where: { showtimeId: id },
    });
    if (seats.length === 0)
        throw new AppError(
            "SEAT_NOT_FOUND",
            "seats for this showtime not found",
            404
        );

    await seat.destroy({ where: { showtimeId: id } });
    res.status(201).json({ message: "seats were successfully deleted." });
});

module.exports = { getListOfSeats, createSeats, deleteSeats };
