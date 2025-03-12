require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const app = express();

// app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// module.exports = app;

// all routes will be here
app.use("/api/users", userRoutes);
// app.use("/api/movies", movieRoutes);
// app.use("/api/showtimes", showtimeRoutes);
// app.use("/api/reservations", reservationRoutes);

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

// app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, async () => {
    console.log("Server up and running", PORT);
    await sequelize;
    // try {
    //     // Sync models with database
    //     await sequelize.sync({ alter: true });
    //     console.log("Database synchronized successfully");
    // } catch (error) {
    //     console.error("!!! Unable to connect to the database:", error);
    // }
});
