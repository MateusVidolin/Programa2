const Sequelize = require('sequelize');
const connection = require('../database/database');

const Professor = connection.define(
    'professor',
    {
        numeroRegistro: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        area: {
            type: Sequelize.STRING,
            allowNull: false
        },
        categoria: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ano: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
);

//Professor.sync({force: true});

module.exports = Professor;