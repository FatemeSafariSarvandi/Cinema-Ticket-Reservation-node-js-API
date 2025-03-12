"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user", {
            userName: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM("user", "admin"),
                defaultValue: "user",
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("user");
    },
};
