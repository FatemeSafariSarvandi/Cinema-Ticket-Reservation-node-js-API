const Reservation = require("../db/models/reservation");
const seat = require("../db/models/seat");
const Showtime = require("../db/models/showtime");
const AppError = require("../utilities/appError");
const {
    tryCatchReservationHandler,
} = require("../utilities/tryCatchReservationHandler");
const { tryCatchHandler } = require("../utilities/tryCatchHandler");

// Get
const getReservation = tryCatchHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        throw new AppError(
            "INVALID_ID",
            "Invalid reservationId. It must be a valid number.",
            400
        );
    }

    const reservation = await Reservation.findByPk(id);
    if (!reservation || reservation.length === 0) {
        throw new AppError(
            "RESERVATION_NOT_FOUND",
            "reservation not found",
            404
        );
    }
    // Check if the logged-in user is the owner of the reservation
    if (reservation.userName !== req.user.userName) {
        throw new AppError(
            "RESERVATON_FORBIDDEN",
            "You can only cancel your own reservations",
            403
        );
    }

    res.status(200).json(reservation);
});

const createReservation = tryCatchReservationHandler(
    async (req, res, transaction) => {
        const { showtimeId, seatId } = req.body;

        // Validate input data
        if (
            !showtimeId ||
            !seatId ||
            isNaN(Number(showtimeId)) ||
            isNaN(Number(seatId))
        ) {
            throw new AppError("INVALID_INPUT", "Invalid input data", 400);
        }

        // Checking that the seat is in the "available" state and locked
        const availableSeat = await seat.findOne({
            where: { id: seatId, showtimeId, status: "available" },
            lock: transaction.LOCK.UPDATE,
            transaction,
        });

        if (!availableSeat) {
            throw new AppError(
                "RESERVATION_SEAT_NOT_AVAILABLE",
                "Seat is not available for reservation",
                400
            );
        }
        // Get relevant showtime information
        const showtime = await Showtime.findByPk(showtimeId, { transaction });
        if (!showtime) {
            throw new AppError(
                "RESERVATON_SHOWTIME_NOT_FOUND",
                "Showtime not found",
                404
            );
        }

        //Check if the current time is before the timeshow start time
        const currentTime = new Date();
        const showtimeDateTime = new Date(
            `${showtime.date}T${showtime.time}:00:00`
        );

        if (currentTime >= showtimeDateTime) {
            throw new AppError(
                "RESERVATION_CONFLICT",
                "Cannot reservation after showtime has started",
                409
            );
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

        res.status(201).json({
            message: "Seat reserved successfully",
            reservation,
        });
    }
);

// Cancel reservation

const deleteReservation = tryCatchReservationHandler(
    async (req, res, transaction) => {
        const { id } = req.params;

        // Validate input data
        if (!id || isNaN(Number(id))) {
            throw new AppError("INVALID_ID", "Invalid id", 400);
        }

        // Get reservation information
        const reservation = await Reservation.findByPk(id, { transaction });
        if (!reservation) {
            throw new AppError(
                "RESERVATON_NOT_FOUND",
                "Reservation not found",
                404
            );
        }

        // Check if the logged-in user is the owner of the reservation
        if (reservation.userName !== req.user.userName) {
            throw new AppError(
                "RESERVATON_FORBIDDEN",
                "You can only cancel your own reservations",
                403
            );
        }

        // Get relevant showtime information
        const showtime = await Showtime.findByPk(reservation.showtimeId, {
            transaction,
        });
        if (!showtime) {
            throw new AppError(
                "RESERVATON_SHOWTIME_NOT_FOUND",
                "Showtime not found",
                404
            );
        }

        //Check if the current time is before the timeshow start time
        const currentTime = new Date();
        const showtimeDateTime = new Date(
            `${showtime.date}T${showtime.time}:00:00`
        );

        if (currentTime >= showtimeDateTime) {
            throw new AppError(
                "RESERVATION_CONFLICT",
                "Cannot cancel reservation after showtime has started",
                409
            );
        }

        //Change seat status to "available"
        await seat.update(
            { status: "available" },
            { where: { id: reservation.seatId }, transaction }
        );

        await reservation.destroy({ transaction });

        res.status(200).json({
            message: "Reservation cancelled and seat is now available",
        });
    }
);

module.exports = {
    getReservation,
    createReservation,
    deleteReservation,
};
