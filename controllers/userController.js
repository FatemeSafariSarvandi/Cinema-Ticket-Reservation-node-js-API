require("dotenv").config({ path: `${process.cwd()}/.env` });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../db/models/user");
const { tryCatchHandler } = require("../utilities/tryCatchHandler");
const AppError = require("../utilities/appError");

const register = tryCatchHandler(async (req, res) => {
    const { userName, name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new AppError("INVALID_INPUT", "Invalid email format", 400);
    }

    //Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = await user.create({
        userName,
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            userName: newUser.userName,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
        },
    });
});

const login = tryCatchHandler(async (req, res) => {
    const { userName, password } = req.body;

    const userRec = await user.findOne({ where: { userName } });
    if (!userRec)
        throw new AppError(
            "USER_NOT_FOUND",
            "Incorrect username or password",
            404
        );

    const isMatch = await bcrypt.compare(password, userRec.password);
    if (!isMatch)
        throw new AppError(
            "USER_NOT_FOUND",
            "Incorrect username or password",
            404
        );

    const token = jwt.sign(
        { userName: userRec.userName, role: userRec.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
    );
    res.status(201).json({ token });
});

module.exports = {
    register,
    login,
};
