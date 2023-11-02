const express = require('express');
const router = express.Router();
const Feriado = require('../models/feriado');

exports.renderIndex = (req, res, next) => {
    res.render('feriado/index');
}

exports.getAll= (req, res, next) => {
    Feriado.findAll({
        order: [
            ['nomeFeriado', 'ASC']
        ]
    }).then(feriados => {
        res.render('feriado/index', {feriados: feriados});
    })
}

exports.renderNovo = (req, res, next) => {
    res.render('feriado/novo');
}


exports.create = (req, res, next) => {
    const nomeFeriado = req.body.nomeFeriado;
    const tipo = req.body.tipo;
    const dataFeriado = req.body.dataFeriado; 

    Feriado.findOne({
        where: {
            nomeFeriado : nomeFeriado
        }
    }).then(feriado => {
        if((feriado == undefined) && (tipo!= "Null"))
        {
            Feriado.create({
                nomeFeriado: nomeFeriado,
                tipo: tipo,
                dataFeriado: dataFeriado
            }).then(() => {
                res.redirect('/feriados');
            })
        }
        else
        {
            res.redirect('/feriados');
        }
    });
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;
    Feriado.findByPk(id).then(feriado => {
        res.render('feriado/editar', {feriado: feriado});
    });
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const nomeFeriado = req.body.nomeFeriado;
    const tipo = req.body.tipo;
    const dataFeriado = req.body.dataFeriado; 

    Feriado.update({
        nomeFeriado: nomeFeriado,
        tipo: tipo,
        dataFeriado: dataFeriado
    },
    {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/feriados');
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;

    Feriado.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/feriados');
    });
}
