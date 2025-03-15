require("dotenv").config({ path: `${process.cwd()}/.env` });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../db/models/user");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const register = async (req, res) => {
    try {
        const { userName, name, email, password } = req.body;

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
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            // Handle Unique Constraint Errors
            const fieldErrors = {};
            error.errors.forEach((err) => {
                fieldErrors[err.path] = `${err.path} already exists`;
            });

            return res.status(409).json({
                error: "Conflict",
                message: "A user with this information already exists.",
                details: fieldErrors,
            });
        } else if (error instanceof ValidationError) {
            // Handle Validation Errors
            return res.status(400).json({
                error: "Validation Error",
                message: "Invalid input data",
                details: error.errors.map((err) => ({
                    field: err.path,
                    message: err.message,
                })),
            });
        } else {
            // Handle Other Errors
            console.error(error);
            return res.status(500).json({
                error: "Internal Server Error",
                message: "An unexpected error occurred.",
            });
        }
    }
};

const login = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const userRec = await user.findOne({ where: { userName } });
        if (!userRec)
            return res
                .status(404)
                .json({ error: "Incorrect username or password" });

        const isMatch = await bcrypt.compare(password, userRec.password);
        if (!isMatch)
            return res
                .status(400)
                .json({ error: "Incorrect username or password" });

        const token = jwt.sign(
            { userName: userRec.userName, role: userRec.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
module.exports = {
    register,
    login,
};
