const Sequelize = require('sequelize');
const connection = require('../database/database');

const Usuario = connection.define(
    'usuario',
    {
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
);
    /*Usuario.create({
    email:'teste@fatec.com',
    nome: 'Secretária',
    senha:'1111'
})*///Cria usuário para o sistema

//Usuario.sync({force: true});

module.exports = Usuario;