const express = require('express');
const router = express.Router();
const Feriado = require('../models/feriado');
const {fmDate, DataParaBanco, DataParaBancoFeriado} = require('../utilidades');

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
    const msgNOKCreateFeriado = req.query.msgNOKCreateFeriado;

    res.render('feriado/novo', {msgNOKCreateFeriado});
}


exports.create = (req, res, next) => {
    const nomeFeriado = req.body.nomeFeriado;
    const tipo = req.body.tipo;
    const dataFeriado = DataParaBancoFeriado(req.body.dataFeriado);
    let msgOK = '1';
    let msgNOKCreateFeriado = '1'; 

    Feriado.findOne({
        where: {
            dataFeriado : dataFeriado
        }
    }).then(feriado => {
        if((feriado == undefined) && (tipo!= undefined))
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
            res.redirect('/feriados/novo/?msgNOKCreateFeriado=' + msgNOKCreateFeriado);
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
    const dataFeriado = DataParaBancoFeriado(req.body.dataFeriado);
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
