const express = require('express');
const router = express.Router();
const Professor = require('../models/professor');

exports.renderIndex = (req, res, next) => {
    res.render('professor/index');
}

exports.getAll= (req, res, next) => {
    Professor.findAll({
        order: [
            ['nome', 'ASC']
        ]
    }).then(professors => {
        res.render('professor/index', {professors: professors});
    })
}

exports.renderNovo = (req, res, next) => {
    res.render('professor/novo');
}

exports.renderBusca = (req, res, next) =>{
   
        res.render('professor/busca');
}

exports.resultadoBusca = (req, res, next) =>{
    const numeroRegistro = req.body.numeroRegistro;
    const nome = req.body.nome;
    const area = req.body.area;
    const categoria = req.body.categoria;
    const ano = req.body.ano;
    const status = req.body.status;
    
        Professor.findOne({
            where: {
                numeroRegistro : numeroRegistro
            }
        }).then(professor => {
            if(professor == undefined)
            {
                    res.redirect('/professors/busca');
            }
            else
            {
                res.render('professor/resultadoBusca', {professor: professor});
            }
        })
    }


exports.create = (req, res, next) => {
    const numeroRegistro = req.body.numeroRegistro;
    const nome = req.body.nome;
    const area = req.body.area;
    const categoria = req.body.categoria;
    const ano = req.body.ano;
    const status = req.body.status;

    Professor.findOne({
        where: {
            numeroRegistro : numeroRegistro
        }
    }).then(professor => {
        if(professor == undefined)
        {
            Professor.create({
                numeroRegistro: numeroRegistro,
                nome: nome,
                area: area,
                categoria: categoria,
                ano: ano,
                status: status
            }).then(() => {
                res.redirect('/professors');
            })
        }
        else
        {
            res.redirect('/professors');
        }
    })
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;
    Professor.findByPk(id).then(professor => {
        res.render('professor/editar', {professor: professor});
    });
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const numeroRegistro = req.body.numeroRegistro;
    const nome = req.body.nome;
    const area = req.body.area;
    const categoria = req.body.categoria;
    const ano = req.body.ano;
    const status = req.body.status;

    Professor.update({
        numeroRegistro: numeroRegistro,
        nome: nome,
        area: area,
        categoria: categoria,
        ano: ano,
        status: status
    },
    {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/professors');
    });
}

exports.delete = (req, res, next) => {
    const id = req.params.id;

    Professor.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/professors');
    });
}
