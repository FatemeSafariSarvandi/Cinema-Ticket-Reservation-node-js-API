const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const movie = require("./movie");

const showtime = sequelize.define(
    "showtime",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        movieId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: movie,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
    {
        tableName: "showtime",
        timestamps: false,
    }
);

movie.hasMany(showtime, { foreignKey: "movieId" });
showtime.belongsTo(movie, { foreignKey: "movieId" });

module.exports = showtime;
