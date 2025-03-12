const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const user = require("./user");
const showtime = require("./showtime");
const seat = require("./seat");

const reservation = sequelize.define("reservation", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: showtime,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: seat,
            key: "id",
        },
        onDelete: "CASCADE",
    },
});

user.hasMany(reservation, { foreignKey: "userName" });
reservation.belongsTo(user, { foreignKey: "userName" });

showtime.hasMany(reservation, { foreignKey: "showtimeId" });
reservation.belongsTo(showtime, { foreignKey: "showtimeId" });

seat.hasOne(reservation, { foreignKey: "seatId" });
reservation.belongsTo(seat, { foreignKey: "seatId" });

module.exports = reservation;
