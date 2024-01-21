const Sequelize = require('sequelize');
const connection = require('../database/database');
const Disciplina = require('./disciplina');
const Professor = require('./professor');

const Impressao = connection.define(
    'impressao',
    {
        idDisciplina1:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        horarioDisc1:{
            type: Sequelize.TIME,
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
        idDisciplina2:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc2:{
            type: Sequelize.TIME,
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
        idDisciplina3:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc3:{
            type: Sequelize.TIME,
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
        idDisciplina4:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc4:{
            type: Sequelize.TIME,
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
        idDisciplina5:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc5:{
            type: Sequelize.TIME,
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
        idDisciplina6:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc6:{
            type: Sequelize.TIME,
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
        idDisciplina7:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc7:{
            type: Sequelize.TIME,
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
        idDisciplina8:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc8:{
            type: Sequelize.TIME,
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
        idDisciplina9:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc9:{
            type: Sequelize.TIME,
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
        idDisciplina10:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc10:{
            type: Sequelize.TIME,
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
        idDisciplina11:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc11:{
            type: Sequelize.TIME,
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
        idDisciplina12:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc12:{
            type: Sequelize.TIME,
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
        idDisciplina13:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc13:{
            type: Sequelize.TIME,
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
        idDisciplina14:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc14:{
            type: Sequelize.TIME,
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
        idDisciplina15:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        horarioDisc15:{
            type: Sequelize.TIME,
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
        hae1:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        hae2:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        hae3:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        hae4:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        diaSemanaHae1:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaHae2:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaHae3:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaHae4:{
            type: Sequelize.STRING,
            allowNull: true
        },
        horarioHae1:{
            type: Sequelize.TIME,
            allowNull: true
        },
        horarioHae2:{
            type: Sequelize.TIME,
            allowNull: true
        },
        horarioHae3:{
            type: Sequelize.TIME,
            allowNull: true
        },
        horarioHae4:{
            type: Sequelize.TIME,
            allowNull: true
        },
        haec1:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        haec2:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        haec3:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        haec4:{
            type: Sequelize.INTEGER,
            allowNull: true
        },
        diaSemanaHaec1:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaHaec2:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaHaec3:{
            type: Sequelize.STRING,
            allowNull: true
        },
        diaSemanaHaec4:{
            type: Sequelize.STRING,
            allowNull: true
        },
        horarioHaec1:{
            type: Sequelize.TIME,
            allowNull: true
        },
        horarioHaec2:{
            type: Sequelize.TIME,
            allowNull: true
        },
        horarioHaec3:{
            type: Sequelize.TIME,
            allowNull: true
        },
        horarioHaec4:{
            type: Sequelize.TIME,
            allowNull: true
        }, 
        anoImpressao: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    }
);

Impressao.belongsTo(Disciplina);
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina1', as: 'IdDisciplina1'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina2', as: 'IdDisciplina2'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina3', as: 'IdDisciplina3'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina4', as: 'IdDisciplina4'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina5', as: 'IdDisciplina5'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina6', as: 'IdDisciplina6'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina7', as: 'IdDisciplina7'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina8', as: 'IdDisciplina8'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina9', as: 'IdDisciplina9'});
Impressao.belongsTo(Disciplina, {foreignKey: 'idDisciplina10', as: 'IdDisciplina10'});
Impressao.belongsTo(Professor);

//Impressao.sync({force: true});

module.exports = Impressao;