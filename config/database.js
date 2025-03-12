// const { Sequelize } = require('sequelize');

// const env = process.env.NODE_ENV || 'development';
// const config = require('./config');

// const sequelize = new Sequelize(config[env]);

// module.exports = sequelize;

require("dotenv").config({ path: `${process.cwd()}/.env` });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    seederStorage: "sequelize",
});

sequelize
    .authenticate()
    .then(() => console.log("Database connected..."))
    .catch((err) =>
        console.log("!!! Unable to connect to the database:  " + err)
    );

module.exports = sequelize;
