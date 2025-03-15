const showtime = require("../db/models/showtime");
const AppError = require("../utilities/appError");
const { tryCatchHandler } = require("../utilities/tryCatchHandler");
const dayjs = require("dayjs");

const getShowtimes = tryCatchHandler(async (req, res) => {
    const { movieId } = req.params;
    if (!movieId || isNaN(Number(movieId))) {
        throw new AppError(
            "INVALID_ID",
            "Invalid movieId. It must be a valid number.",
            400
        );
    }

    const showtimes = await showtime.findAll({
        where: { movieId: movieId },
    });
    if (!showtimes || showtimes.length === 0) {
        throw new AppError(
            "SHOWMOVIE_NOT_FOUND",
            "No showtimes found for the given movieId.",
            404
        );
    }
    res.status(200).json(showtimes);
});

// Get movie showtimes by time
const getShowtimeByTime = tryCatchHandler(async (req, res) => {
    const { time } = req.params;
    if (!time || isNaN(Number(time))) {
        throw new AppError(
            "INVALID_INPUT",
            "Invalid time. It must be a valid number.",
            400
        );
    }

    const showtimes = await showtime.findAll({
        where: { time: time },
    });
    if (!showtimes || showtimes.length === 0) {
        throw new AppError(
            "SHOWMOVIE_NOT_FOUND",
            "No showtimes found for the given time.",
            404
        );
    }
    res.status(200).json(showtimes);
});

// Get movie showtimes by date
const getShowtimeByDate = tryCatchHandler(async (req, res) => {
    const showtimes = await showtime.findAll({
        where: { date: req.params.date },
    });
    if (!showtimes || showtimes.length === 0) {
        throw new AppError(
            "SHOWMOVIE_NOT_FOUND",
            "No showtimes found for the given date.",
            404
        );
    }
    res.status(200).json(showtimes);
});

//Add a showtime (admin only)
const addShowtime = tryCatchHandler(async (req, res) => {
    if (req.user.role !== "admin")
        throw new AppError("UNAUTHORIZED", "Unauthorized", 403);

    const { movieId, date, time } = req.body;

    // Validate input data
    if (
        !movieId ||
        !date ||
        !time ||
        isNaN(Number(movieId)) ||
        isNaN(Number(time))
    ) {
        throw new AppError("INVALID_INPUT", "Invalid input data", 400);
    }

    //! When using `new Date` instead of the time value, it returns `invalid`, so I had to use `dayjs`.
    // const showtimeDateTime = new Date(`${date}T${time}:00:00`);
    const showtimeDateTime = dayjs(`${date}T${time}:00:00`).toDate();
    const currentTime = new Date();
    if (currentTime >= showtimeDateTime) {
        throw new AppError(
            "SHOWTIME_CONFLICT",
            "Cannot create showtime before current time",
            409
        );
    }

    const existingShowtime = await showtime.findOne({
        where: { date, time },
    });

    if (existingShowtime) {
        throw new AppError(
            "SHOWTIME_CONFLICT",
            "Another movie is already scheduled at this time.",
            409
        );
    }

    const newShowtime = await showtime.create({ movieId, date, time });
    res.status(201).json(newShowtime);
});

// Delete showtime (Admin Only)
const deleteShowTime = tryCatchHandler(async (req, res) => {
    if (req.user.role !== "admin")
        throw new AppError("UNAUTHORIZED", "Unauthorized", 403);

    const { id } = req.params;

    // Validate input data
    if (!id || isNaN(Number(id))) {
        throw new AppError("INVALID_ID", "Invalid id", 400);
    }

    const deletedshowtime = await showtime.findByPk(id);
    if (!deletedshowtime)
        throw new AppError("SHOWMOVIE_NOT_FOUND", "showtime not found", 404);

    await deletedshowtime.destroy();
    res.status(204).json({ message: "The showtime was successfully deleted." });
});

module.exports = {
    getShowtimes,
    getShowtimeByTime,
    getShowtimeByDate,
    addShowtime,
    deleteShowTime,
};
