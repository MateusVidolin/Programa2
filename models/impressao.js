const Sequelize = require('sequelize');
const connection = require('../database/database');
const Disciplina = require('./disciplina');
const Professor = require('./professor');

const Impressao = connection.define(
    'impressao',
    {
        IdDisciplina1:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        horarioDisc1:{
            type: Sequelize.STRING,
            allowNull: false
        },
        diaSemanaDisc1:{
            type: Sequelize.STRING,
            allowNull: false
        },
        aulasDisc1:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        IdDisciplina2:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc2:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc2:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc2:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina3:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc3:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc3:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc3:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina4:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc4:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc4:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc4:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina5:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc5:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc5:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc5:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina6:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc6:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc6:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc6:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina7:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc7:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc7:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc7:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina8:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc8:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc8:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc8:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina9:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc9:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc9:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc9:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina10:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc10:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc10:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc10:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina11:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc11:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc11:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc11:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina12:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc12:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc12:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc12:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina13:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc13:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc13:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc13:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina14:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc14:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc14:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc14:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdDisciplina15:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc15:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaDisc15:{
            type: Sequelize.STRING,
            allowNull: true
        },
        aulasDisc15:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        hae:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        diaHae:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioHae:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        haec:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        diaHaec:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioHaec:{
            type: Sequelize.INTEGER,
            allowNull: true
        },  
        anoImpressao: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    }
);

Impressao.belongsTo(Disciplina);
Impressao.belongsTo(Professor);

//Impressao.sync({force: true});

module.exports = Impressao;