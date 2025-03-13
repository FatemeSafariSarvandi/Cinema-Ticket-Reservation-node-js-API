const express = require("express");
const movie = require("../db/models/movie");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get Movie List
router.get("/", async (req, res) => {
    const movies = await movie.findAll();
    res.json(movies);
});

// Get Movie Details
router.get("/:id", async (req, res) => {
    const movieDetails = await movie.findByPk(req.params.id);
    if (!movieDetails)
        return res.status(404).json({ error: "Movie not found" });
    res.json(movieDetails);
});

// Get list of Movies by genre
router.get("/genre/:genre", async (req, res) => {
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
        res.status(500).json({ error: error.message });
    }
});

// Add Movie (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
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
        res.status(400).json({ error: error.message });
    }
});

// Delete Movie (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin")
        return res.status(403).json({ error: "Unauthorized" });

    const deletedMovie = await movie.findByPk(req.params.id);
    if (!deletedMovie)
        return res.status(404).json({ error: "Movie not found" });

    await deletedMovie.destroy();
    res.json({ message: "The movie was successfully deleted." });
});

module.exports = router;
