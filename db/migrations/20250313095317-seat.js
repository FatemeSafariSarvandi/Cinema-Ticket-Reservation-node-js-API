"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("seat", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            showtimeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "showtime",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            seatNumber: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 100,
                    isInt: true,
                },
            },
            status: {
                type: Sequelize.ENUM("available", "reserved"),
                defaultValue: "available",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("seat");
    },
};
