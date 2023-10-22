const express = require('express');
const router = express.Router();
const Curso = require('../models/curso');

exports.renderIndex = (req, res, next) => {
    res.render('curso/index');
}

exports.getAll= (req, res, next) => {
    Curso.findAll({
        order: [
            ['nomeCurso', 'ASC']
        ]
    }).then(cursos => {
        res.render('curso/index', {cursos: cursos});
    })
}

exports.renderNovo = (req, res, next) => {
    res.render('curso/novo');
}


exports.create = (req, res, next) => {
    const codigoCurso = req.body.codigoCurso;
    const nomeCurso = req.body.nomeCurso;
    const periodo = req.body.periodo;

    Curso.findOne({
        where: {
            codigoCurso : codigoCurso
        }
    }).then(curso => {
        if((curso == undefined) && (periodo!= "Null"))
        {
            Curso.create({
                codigoCurso: codigoCurso,
                nomeCurso: nomeCurso,
                periodo: periodo
            }).then(() => {
                res.redirect('/cursos');
            })
        }
        else
        {
            res.redirect('/cursos');
        }
    });
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;
    Curso.findByPk(id).then(curso => {
        res.render('curso/editar', {curso: curso});
    });
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const codigoCurso = req.body.codigoCurso;
    const nomeCurso = req.body.nomeCurso;
    const periodo = req.body.periodo;

    Curso.update({
        codigoCurso: codigoCurso,
        nomeCurso: nomeCurso,
        periodo: periodo
    },
    {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/cursos');
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;

    Curso.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/cursos');
    });
}
