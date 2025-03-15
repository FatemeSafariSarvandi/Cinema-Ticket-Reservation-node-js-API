const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    createReservation,
    deleteReservation,
} = require("../controllers/reservationController");

const router = express.Router();

// Create a reservation
router.post("/", authMiddleware, createReservation);

// Cancel reservation
router.delete("/:id", authMiddleware, deleteReservation);

module.exports = router;
