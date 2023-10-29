const Sequelize = require('sequelize');
const connection = require('../database/database');

const Feriado = connection.define(
    'feriado',
    {
        nomeFeriado: {
            type: Sequelize.STRING,
            allowNull: false
        },
        dtaFeriado: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        tipo: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
);

//Feriado.sync({force: true});

module.exports = Feriado;