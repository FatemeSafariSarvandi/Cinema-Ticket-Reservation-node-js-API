const errorHandler = (error, req, res, next) => {
    res.status(400).send("some thing failed");
};

module.exports = errorHandler;
