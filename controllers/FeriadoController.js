const express = require('express');
const router = express.Router();
const Feriado = require('../models/feriado');

exports.renderIndex = (req, res, next) => {
    res.render('feriado/index');
}

exports.getAll= (req, res, next) => {
    const msgOK = req.query.msgOK;
    const msgNOK = req.query.msgNOK;

    Feriado.findAll({
        order: [
            ['nomeFeriado', 'ASC']
        ]
    }).then(feriados => {
        res.render('feriado/index', {feriados: feriados, msgOK, msgNOK});
    })
}

exports.renderNovo = (req, res, next) => {
    res.render('feriado/novo');
}


exports.create = (req, res, next) => {
    const nomeFeriado = req.body.nomeFeriado;
    const tipo = req.body.tipo;
    const dataFeriado = req.body.dataFeriado;
    let msgOK = '1';
    let msgNOK = '0'; 

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
                res.redirect('/feriados/?msgOK=' + msgOK);
            })
        }
        else
        {
            res.redirect('/feriados/?msgNOK=' + msgNOK);
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
    let msgOK = '1';
    let msgNOK = '0';  

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
        res.redirect('/feriados/?msgOK=' + msgOK);
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;
    let msgOK = '1';
    let msgNOK = '0'; 

    Feriado.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/feriados/?msgOK=' + msgOK);
    });
}
