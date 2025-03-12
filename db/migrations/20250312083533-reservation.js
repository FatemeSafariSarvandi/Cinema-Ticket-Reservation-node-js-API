"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("reservation", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "user",
                    key: "userName",
                },
                onDelete: "CASCADE",
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
            seatId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "seat",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("reservation");
    },
};
