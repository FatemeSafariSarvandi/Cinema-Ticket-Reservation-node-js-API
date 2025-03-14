const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const movie = sequelize.define(
    "movie",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: DataTypes.ENUM(
                "Comedic",
                "Drama",
                "Action",
                "Romance",
                "Melodrama",
                "Mystery",
                "Sci-Fi",
                "Horror"
            ),
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: "movie",
        timestamps: false,
    }
);

module.exports = movie;
