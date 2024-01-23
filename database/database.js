const Sequelize = require('sequelize');

const connection = new Sequelize(
    'usuario',
    'admin',
    '1234Mateus',
    {
        host: 'banco-de-dados-do-sistema-sgrp.clas2kasu747.us-east-2.rds.amazonaws.com',
        dialect: 'mysql',
        timezone: '-03:00'
    }
);

module.exports = connection;