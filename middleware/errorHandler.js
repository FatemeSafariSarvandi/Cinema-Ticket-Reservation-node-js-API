// const AppError = require("../utilities/appError");
// const { ValidationError, UniqueConstraintError } = require("sequelize");

// const errorHandler = (error, req, res, next) => {
//     console.log(error.message);
//     console.log(error.name);

//     if (error instanceof UniqueConstraintError) {
//         return res
//             .status(409)
//             .json("A user with this information already exists.");
//     } else if (error instanceof ValidationError) {
//         return res.status(500).json("Validation is failed");
//     } else if (error.name == "SequelizeDatabaseError") {
//         return res.status(400).json({ message: error.message });
//     } else if (error.name == "SyntaxError") {
//         return res.status(400).json({ message: "is not valid JSON" });
//     } else if (error.name == "TypeError") {
//         return res
//             .status(400)
//             .json({ message: "Cannot read properties of undefined" });
//     } else if (error instanceof AppError) {
//         return res
//             .status(error.statusCode)
//             .json({ errorCode: error.errorCode, message: error.message });
//     }

//     res.status(500).json({
//         errorCode: "INTERNAL_SERVER_ERROR",
//         message: "An unexpected error occurred. Please try again later.",
//     });
// };

// module.exports = errorHandler;

const AppError = require("../utilities/appError");
const {
    ValidationError,
    UniqueConstraintError,
    DatabaseError,
} = require("sequelize");

const errorHandler = (error, req, res, next) => {
    console.error("ERROR OCCURRED:");
    console.error("Name:", error.name);
    console.error(" Message:", error.message);
    console.error("Stack Trace:", error.stack);

    if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
            errorCode: "DUPLICATE_ENTRY",
            message: "A record with this information already exists.",
            details: error.errors?.map((err) => err.message) || [],
        });
    }

    if (error instanceof ValidationError) {
        return res.status(400).json({
            errorCode: "VALIDATION_FAILED",
            message: "Validation failed. Please check your input.",
            details: error.errors?.map((err) => err.message) || [],
        });
    }

    if (
        error instanceof DatabaseError ||
        error.name === "SequelizeDatabaseError"
    ) {
        return res.status(400).json({
            errorCode: "DATABASE_ERROR",
            message: "A database error occurred.",
            details: error.message,
        });
    }

    if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return res.status(400).json({
            errorCode: "INVALID_JSON",
            message: "The request body is not valid JSON.",
        });
    }

    if (error instanceof TypeError) {
        return res.status(400).json({
            errorCode: "TYPE_ERROR",
            message:
                "Cannot read properties of undefined. Please check your request.",
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
            message: error.message,
        });
    }

    const statusCode = error.statusCode || 500;

    if (statusCode === 400) {
        return res.status(400).json({
            errorCode: "BAD_REQUEST",
            message: error.message || "Invalid request.",
        });
    }

    return res.status(500).json({
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred. Please try again later.",
    });
};

module.exports = errorHandler;
