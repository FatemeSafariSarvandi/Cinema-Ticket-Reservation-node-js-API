const express = require("express");
const movie = require("../db/models/movie");
const authMiddleware = require("../middleware/authMiddleware");

// Get Movie List
const getMovies = async (req, res, next) => {
    try {
        const movies = await movie.findAll();
        res.json(movies);
    } catch (error) {
        next(error);
    }
};

// Get Movie Details
const getMovieDetails = async (req, res) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid id." });
    }
    try {
        const movieDetails = await movie.findByPk(id);
        if (!movieDetails)
            return res.status(404).json({ error: "Movie not found" });
        res.json(movieDetails);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

//Get list of Movies by genre
const getMoviesByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const movies = await movie.findAll({ where: { genre } });

        if (movies.length === 0) {
            return res
                .status(404)
                .json({ message: "No movies found for this genre" });
        }

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Add Movie (Admin Only)
const addMovie = async (req, res, next) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { title, genre, duration, description } = req.body;
    try {
        const newMovie = await movie.create({
            title,
            genre,
            duration,
            description,
        });
        res.status(201).json(newMovie);
    } catch (error) {
        next(error);
    }
};

// Delete Movie (Admin Only)
const deleteMovie = async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid id." });
    }

    try {
        const deletedMovie = await movie.findByPk(id);
        if (!deletedMovie)
            return res.status(404).json({ error: "Movie not found" });

        await deletedMovie.destroy();
        res.json({ message: "The movie was successfully deleted." });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getMovies,
    getMovieDetails,
    getMoviesByGenre,
    addMovie,
    deleteMovie,
};
