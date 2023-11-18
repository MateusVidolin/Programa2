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
    res.render('disciplina/novo', {cursos: cursos});
    });
}


exports.create = (req, res, next) => {
    const codigoDisciplina = req.body.codigoDisciplina;
    const nomeDisciplina = req.body.nomeDisciplina;
    const semestre = req.body.semestre;
    const periodo = req.body.periodo;
    const cursoId = req.body.cursoId;
    let msgOK = '1';
    let msgNOK = '0'; 

    Disciplina.findOne({
        where: {
            codigoDisciplina : codigoDisciplina
        }
    }).then(disciplina => {
        if((disciplina == undefined) && (periodo!= "Null"))
        {
            Disciplina.create({
                codigoDisciplina: codigoDisciplina,
                nomeDisciplina: nomeDisciplina,
                semestre: semestre,
                periodo: periodo,
                cursoId: cursoId
            }).then(() => {
                res.redirect('/disciplinas/?msgOK=' + msgOK);
            })
        }
        else
        {
            res.redirect('/disciplinas/?msgNOK=' + msgNOK);
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
                'nomeCurso'
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
    const periodo = req.body.periodo;
    let msgOK = '1';
    let msgNOK = '0'; 

    Disciplina.update({
        codigoDisciplina: codigoDisciplina,
        nomeDisciplina: nomeDisciplina,
        semestre: semestre,
        periodo: periodo
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