const Sequelize = require('sequelize');
const connection = require('../database/database');

const Curso = connection.define(
    'curso',
    {
        codigoCurso: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nomeCurso: {
            type: Sequelize.STRING,
            allowNull: false
        },
        periodo: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
);

//Curso.sync({force: true});

module.exports = Curso;