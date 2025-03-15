const seat = require("../db/models/seat");
exports.tryCatchReservationHandler = (controller) => {
    return async (req, res, next) => {
        const transaction = await seat.sequelize.transaction();
        try {
            await controller(req, res, transaction);

            await transaction.commit();
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            next(error);
        }
    };
};
