const express = require("express");
const movie = require("../db/models/movie");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getMovies,
    getMovieDetails,
    getMoviesByGenre,
    addMovie,
    deleteMovie,
} = require("../controllers/movieController");

const router = express.Router();

// Get Movie List
router.get("/", getMovies);

// Get Movie Details
router.get("/:id", getMovieDetails);

// Get list of Movies by genre
router.get("/genre/:genre", getMoviesByGenre);

// Add Movie (Admin Only)
router.post("/", authMiddleware, addMovie);

// Delete Movie (Admin Only)
router.delete("/:id", authMiddleware, deleteMovie);

module.exports = router;
