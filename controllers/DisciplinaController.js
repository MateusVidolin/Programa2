const express = require('express');
const router = express.Router();
const Disciplina = require('../models/disciplina');

exports.renderIndex = (req, res, next) => {
    res.render('disciplina/index');
}

exports.getAll= (req, res, next) => {
    Disciplina.findAll({
        order: [
            ['nomeDisciplina', 'ASC']
        ]
    }).then(disciplinas => {
        res.render('disciplina/index', {disciplinas: disciplinas});
    })
}

exports.renderNovo = (req, res, next) => {
    res.render('disciplina/novo');
}


exports.create = (req, res, next) => {
    const codigoDisciplina = req.body.codigoDisciplina;
    const nomeDisciplina = req.body.nomeDisciplina;
    const semestre = req.body.semestre;
    const periodo = req.body.periodo;

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
                periodo: periodo
            }).then(() => {
                res.redirect('/disciplinas');
            })
        }
        else
        {
            res.redirect('/disciplinas');
        }
    });
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;
    Disciplina.findByPk(id).then(disciplina => {
        res.render('disciplina/editar', {disciplina: disciplina});
    });
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const codigoDisciplina = req.body.codigoDisciplina;
    const nomeDisciplina = req.body.nomeDisciplina;
    const semestre = req.body.semestre;
    const periodo = req.body.periodo;

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
        res.redirect('/disciplinas');
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;

    Curso.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/disciplinas');
    });
}