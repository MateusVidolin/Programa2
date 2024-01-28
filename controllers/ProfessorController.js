const express = require('express');
const router = express.Router();
const Professor = require('../models/professor');
const Impressao = require('../models/impressao');
const {DataParaBanco} = require('../utilidades');


exports.getAll= (req, res, next) => {
    const msgOK = req.query.msgOK;
    const msgNOK = req.query.msgNOK;

    Professor.findAll({
        order: [
            ['nome', 'ASC']
        ]
    }).then(professors => {
        res.render('professor/index', {professors: professors, msgOK, msgNOK});
    })
}

exports.renderNovo = (req, res, next) => {

    res.render('professor/novo');
}

/*exports.renderBusca = (req, res, next) =>{
   
        res.render('professor/busca');
}*/

/*exports.resultadoBusca = (req, res, next) =>{
    const numeroRegistro = req.body.numeroRegistro;
    const nome = req.body.nome;
    const status = req.body.status;
    
        Professor.findOne({
            where: {
                nome : nome
            }
        }).then(professor => {
            if(professor == undefined)
            {
                Professor.findOne({
                    where: {
                        numeroRegistro: numeroRegistro
                    }     
                }).then(professor => {
                        if(professor == undefined)
                        {
                            Professor.findOne({
                                where: {
                                    status: status
                                }     
                            }).then(professor => {
                                    if(professor == undefined)
                                        {
                                            res.redirect('/professor/busca');
                                        }
                                        else{
                                            res.render('professor/resultadoBusca', {professor: professor});  
                                        }
                                    })
                        }
                        else{
                            res.render('professor/resultadoBusca', {professor: professor});  
                        }
                    })        
            }
            else{
                res.render('professor/resultadoBusca', {professor: professor});  
            }
        })          
    }
*/

exports.create = (req, res, next) => {
    const numeroRegistro = req.body.numeroRegistro;
    const nome = req.body.nome;
    const area = req.body.area;
    const categoria = req.body.categoria;
    const ano = req.body.ano;
    const status = req.body.status;
    let msgOK = '1';
    let msgNOK = '0';
    let dataParaBanco;

    dataParaBanco = DataParaBanco(ano);
 
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
                ano: dataParaBanco,
                status: status
            }).then(() => {
                res.redirect('/professors/?msgOK=' + msgOK);
            })
        }
        else
        {
            res.redirect('/professors/?msgNOK=' + msgNOK);
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
    let msgOK = '1';
    let msgNOK = '0';

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
        res.redirect('/professors/?msgOK=' + msgOK);
    });
}

exports.delete = (req, res, next) => {
    let msgOK = '1';
    let msgNOK = '0';
    const id = req.params.id;

    Impressao.destroy({
        where: {
            professorId: id 
        }
    }).then(impressao => {
        Professor.destroy({
            where:{
                id: id
               
            }
        }).then(() =>{
        res.redirect('/professors/?msgOK=' + msgOK);
      })  
    });
}
