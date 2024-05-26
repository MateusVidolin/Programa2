const Sequelize = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(
    process.env.DB,
    process.env.USER,
    process.env.PASS,
    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
    }
);

module.exports = connection;