const express = require('express');
const router = express.Router();
const Curso = require('../models/curso');

exports.renderIndex = (req, res, next) => {
    res.render('curso/index');
}

exports.getAll= (req, res, next) => {
    const msgOK = req.query.msgOK;
    const msgNOK = req.query.msgNOK;

    Curso.findAll({
        order: [
            ['nomeCurso', 'ASC']
        ]
    }).then(cursos => {
        res.render('curso/index', {cursos: cursos, msgNOK, msgOK});
    })
}

exports.renderNovo = (req, res, next) => {
    const msgNOKCreateCurso = req.query.msgNOKCreateCurso;

    res.render('curso/novo', {msgNOKCreateCurso});
}


exports.create = (req, res, next) => {
    const codigoCurso = req.body.codigoCurso;
    const nomeCurso = req.body.nomeCurso;
    const periodo = req.body.periodo;
    let msgOK = '1';
    let msgNOKCreateCurso = '1';

    Curso.findOne({
        where: {
            codigoCurso : codigoCurso
        }
    }).then(curso => {
        if((curso == undefined) && (periodo!= undefined))
        {
            Curso.create({
                codigoCurso: codigoCurso,
                nomeCurso: nomeCurso,
                periodo: periodo
            }).then(() => {
                res.redirect('/cursos/?msgOK=' + msgOK);
            })
        }
        else
        {
            res.redirect('/cursos/novo/?msgNOKCreateCurso=' + msgNOKCreateCurso);
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
    let msgOK = '1';
    let msgNOK = '0';

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
        res.redirect('/cursos/?msgOK=' + msgOK);
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;
    let msgOK = '1';
    let msgNOK = '0';

    Curso.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/cursos/?msgOK=' + msgOK);
    });
}
