const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const showtime = require("./showtime");

const seat = sequelize.define(
    "seat",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        seatNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 100,
                isInt: true,
            },
        },
        status: {
            type: DataTypes.ENUM("available", "reserved"),
            defaultValue: "available",
        },
    },
    {
        tableName: "seat",
        timestamps: false,
    }
);

showtime.hasMany(seat, { foreignKey: "showtimeId" });
seat.belongsTo(showtime, { foreignKey: "showtimeId" });

module.exports = seat;
