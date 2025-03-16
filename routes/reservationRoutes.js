const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getReservation,
    createReservation,
    deleteReservation,
} = require("../controllers/reservationController");

const router = express.Router();

router.get("/:id", authMiddleware, getReservation);
// Create a reservation
router.post("/", authMiddleware, createReservation);

// Cancel reservation
router.delete("/:id", authMiddleware, deleteReservation);

module.exports = router;
