const AppError = require("../utilities/appError");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const errorHandler = (error, req, res, next) => {
    if (error instanceof UniqueConstraintError) {
        return res
            .status(409)
            .send("A user with this information already exists.");
    } else if (error instanceof ValidationError) {
        return res.status(500).send("Validation is failed");
    } else if (error instanceof AppError) {
        return res
            .status(error.statusCode)
            .send({ errorCode: error.errorCode, message: error.message });
    }

    res.status(500).send("Internal Server Error");
};

module.exports = errorHandler;
