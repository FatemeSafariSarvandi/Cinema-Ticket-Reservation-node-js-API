const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const user = sequelize.define(
    "user",
    {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },
    },
    {
        tableName: "user",
        timestamps: false,
    }
);

module.exports = user;
