"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("showtime", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            movieId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "movie",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            time: {
                type: Sequelize.TIME,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("showtime");
    },
};
