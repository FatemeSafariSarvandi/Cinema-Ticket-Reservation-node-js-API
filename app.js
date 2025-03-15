require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const seatRoutes = require("./routes/seatRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

// all routes will be here
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Cinema Reservation API is running...",
    });
});

app.use("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: "Route not found",
    });
});

app.use(errorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, async () => {
    console.log("Server up and running", PORT);
    await sequelize;
});
