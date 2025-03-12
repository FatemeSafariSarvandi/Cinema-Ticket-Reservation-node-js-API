"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("user", [
            {
                userName: "admin",
                name: "admin",
                email: "admin@gmail.com",
                password: await bcrypt.hash("hashed_password", 10),
                role: "admin",
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("user", null, {});
    },
};
