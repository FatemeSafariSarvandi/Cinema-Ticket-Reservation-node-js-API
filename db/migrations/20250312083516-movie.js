"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("movie", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            genre: {
                type: Sequelize.ENUM(
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
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("movie");
    },
};
