const movie = require("../db/models/movie");
const AppError = require("../utilities/appError");
const { tryCatchHandler } = require("../utilities/tryCatchHandler");

// Get Movie List
const getMovies = tryCatchHandler(async (req, res) => {
    const movies = await movie.findAll();
    res.status(200).json(movies);
});

// Get Movie Details
const getMovieDetails = tryCatchHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        throw new AppError("INVALID_ID", "Invalid id", 400);
    }
    const movieDetails = await movie.findByPk(id);
    if (!movieDetails)
        throw new AppError("MOVIE_NOT_FOUND", "Movie not found", 404);
    res.status(200).json(movieDetails);
});

//Get list of Movies by genre
const getMoviesByGenre = tryCatchHandler(async (req, res) => {
    const { genre } = req.params;
    const movies = await movie.findAll({ where: { genre } });

    if (movies.length === 0) {
        throw new AppError(
            "MOVIE_NOT_FOUND",
            "No movies found for this genre",
            404
        );
    }

    res.status(202).json(movies);
});

// Add Movie (Admin Only)
const addMovie = tryCatchHandler(async (req, res) => {
    if (req.user.role !== "admin")
        throw new AppError("UNAUTHORIZED", "Unauthorized", 403);

    const { title, genre, duration, description } = req.body;
    // Validate input data
    if (
        title.length === 0 ||
        genre.length === 0 ||
        duration.length === 0 ||
        description.length === 0
    ) {
        throw new AppError("INVALID_INPUT", "Invalid input data", 400);
    }

    const newMovie = await movie.create({
        title,
        genre,
        duration,
        description,
    });
    res.status(201).json(newMovie);
});

// Delete Movie (Admin Only)
const deleteMovie = tryCatchHandler(async (req, res) => {
    if (req.user.role !== "admin")
        throw new AppError("UNAUTHORIZED", "Unauthorized", 403);

    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        throw new AppError("INVALID_ID", "Invalid id", 400);
    }

    const deletedMovie = await movie.findByPk(id);
    if (!deletedMovie)
        throw new AppError("MOVIE_NOT_FOUND", "Movie not found", 404);

    await deletedMovie.destroy();
    res.status(200).json({ message: "The movie was successfully deleted." });
});

module.exports = {
    getMovies,
    getMovieDetails,
    getMoviesByGenre,
    addMovie,
    deleteMovie,
};
