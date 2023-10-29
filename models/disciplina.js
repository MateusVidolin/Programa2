const Sequelize = require('sequelize');
const connection = require('../database/database');

const Disciplina = connection.define(
    'disciplina',
    {
        codigoDisciplina: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nomeDisciplina: {
            type: Sequelize.STRING,
            allowNull: false
        },
        semestre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        periodo: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
);

//Disciplina.sync({force: true});

module.exports = Disciplina;