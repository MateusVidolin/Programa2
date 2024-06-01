const express = require('express');
const router = express.Router();
const Disciplina = require('../models/disciplina');
const Curso = require('../models/curso');

exports.renderIndex = (req, res, next) => {
    res.render('disciplina/index');
}

exports.getAll= (req, res, next) => {
    const msgOK = req.query.msgOK;
    const msgNOK = req.query.msgNOK;

    Disciplina.findAll({
        order: [
            ['nomeDisciplina', 'ASC']
        ]
    }).then(disciplinas => {
        res.render('disciplina/index', {disciplinas: disciplinas, msgNOK, msgOK});
    })
}

exports.renderNovo = (req, res, next) => {
    const msgNOKCreateDisciplina = req.query.msgNOKCreateDisciplina;
    
    Curso.findAll({
        order: [
            ['nomeCurso', 'ASC']
        ],
        attributes: [
            'id',
            'nomeCurso',
            'codigoCurso'
        ]
    }).then(cursos =>{
    res.render('disciplina/novo', {cursos: cursos, msgNOKCreateDisciplina});
    });
}


exports.create = (req, res, next) => {
    const codigoDisciplina = req.body.codigoDisciplina;
    const nomeDisciplina = req.body.nomeDisciplina;
    const semestre = req.body.semestre;
    const cursoId = req.body.cursoId;
    let msgOK = '1';
    let msgNOKCreateDisciplina = '1'; 

    Disciplina.findOne({
        where: {
            codigoDisciplina : codigoDisciplina
        }
    }).then(disciplina => {
        if((disciplina == undefined) && (semestre!= undefined) && (nomeDisciplina!= undefined))
        {
            Disciplina.create({
                codigoDisciplina: codigoDisciplina,
                nomeDisciplina: nomeDisciplina,
                semestre: semestre,
                cursoId: cursoId
            }).then(() => {
                res.redirect('/disciplinas/?msgOK=' + msgOK);
            })
        }
        else
        {
            res.redirect('/disciplinas/novo/?msgNOKCreateDisciplina=' + msgNOKCreateDisciplina);
        }
    });
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;
    Disciplina.findByPk(id).then(disciplina => {
        Curso.findAll({
            order: [
                ['nomeCurso', 'ASC']
            ],
            attributes: [
                'id',
                'nomeCurso',
                'codigoCurso'
            ]
        }).then(cursos =>{
        res.render('disciplina/editar', {disciplina: disciplina, cursos: cursos});
        });
    });
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const codigoDisciplina = req.body.codigoDisciplina;
    const nomeDisciplina = req.body.nomeDisciplina;
    const semestre = req.body.semestre;
    const cursoId = req.body.cursoId;
    let msgOK = '1';
    let msgNOK = '0'; 

    Disciplina.update({
        codigoDisciplina: codigoDisciplina,
        nomeDisciplina: nomeDisciplina,
        semestre: semestre,
        cursoId: cursoId
    },
    {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/disciplinas/?msgOK=' + msgOK);
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;
    let msgOK = '1';
    let msgNOK = '0'; 

    Disciplina.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/disciplinas/?msgOK=' + msgOK);
    });
}