const { DATEONLY } = require('sequelize');
const Curso = require('../models/curso');
const Disciplina = require('../models/disciplina');
const Feriado = require('../models/feriado');
const Impressao = require('../models/impressao');
const Professor = require('../models/professor');

//const {fmDate, DataParaBanco} = require('../utilidades');

exports.getAll = (req, res, next) => {
    Impressao.findAll({
        order: [
            ['id', 'ASC']
        ],
        include: [{
            model: Disciplina  
        },{
            model: Professor
        }]
    }).then(impressaos => {
        res.render('impressao/index', {impressaos: impressaos});
    });
}

exports.renderAdicionaDisc = (req, res, next) => {
    const id = req.params.id;
    Impressao.findByPk(id).then(impressao => {
        Professor.findAll({
            order: [
                ['nome', 'ASC']
            ],
            attributes: [
                'id',
                'nome',
                'numeroRegistro'
            ]
        }).then(professors => {
            Disciplina.findAll({
                order: [
                    ['nomeDisciplina', 'ASC']
                ],
                attributes: [
                    'id',
                    'nomeDisciplina',
                    'codigoDisciplina',
                    'semestre',
                    'periodo'
                ]
                }).then(disciplinas => {
                    res.render('impressao/adicionaDisc', {impressao: impressao, professors: professors, disciplinas: disciplinas});
    
                }); 
            });
    });   
}

exports.adicionarDisc = (req, res, next) => {
    const id = req.body.id;
    const disciplinaId = req.body.disciplinaId;
    const horario = req.body.horarioDisc;
    const diaSemana = req.body.diaSemanaDisc;
    const aulas = req.body.aulasDisc;
        Impressao.findOne({
            where: {
                id: id
            }
        }).then(impressao => {
           if (impressao.IdDisciplina2 == null) {
            impressao.IdDisciplina2 =  disciplinaId,
            impressao.horarioDisc2 = horario,
            impressao.diaSemanaDisc2 = diaSemana,
            impressao.aulasDisc2 = aulas
            impressao.save().then(() => {
                res.redirect('/impressaos');
            });
        };
    });
}

exports.renderNovo = (req, res, next) => {
    Professor.findAll({
        order: [
            ['nome', 'ASC']
        ],
        attributes: [
            'id',
            'nome',
            'numeroRegistro'
        ]
    }).then(professors => {
        Disciplina.findAll({
            order: [
                ['nomeDisciplina', 'ASC']
            ],
            attributes: [
                'id',
                'nomeDisciplina',
                'codigoDisciplina',
                'semestre',
                'periodo'
            ]
            }).then(disciplinas => {
                res.render('impressao/novo', {professors: professors, disciplinas: disciplinas});
            });
        });
}

exports.create = (req, res, next) => {
    const professorId = req.body.professorId;
    const disciplinaId = req.body.disciplinaId;
    const horarioDisciplina = req.body.horarioDisc;
    const diaSemanaDisciplina = req.body.diaSemanaDisc;
    const aulasDisciplina = req.body.aulasDisc;
    const hae = req.body.hae;
    const haec = req.body.haec;
    const anoImpressao = new Date();
    
    Impressao.findOne({
        where: {
            professorId : professorId
        }
    }).then(impressao => {
        if(impressao == undefined)
        {
            Impressao.create({
                professorId: professorId,
                disciplinaId: disciplinaId,
                IdDisciplina1: disciplinaId,
                horarioDisc1: horarioDisciplina,
                diaSemanaDisc1: diaSemanaDisciplina,
                aulasDisc1: aulasDisciplina,
                hae: hae,
                haec: haec,
                anoImpressao: anoImpressao
            }).then(() => {
                res.redirect('/impressaos',);
            })
        }
        else
        {
            res.redirect('/impressaos');
        }
    })
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;
    Impressao.findByPk(id).then(impressao => {
        Professor.findAll({
            order: [
                ['nome', 'ASC']
            ],
            attributes: [
                'id',
                'nome'
            ]
        }).then(professors => {
            Disciplina.findAll({
                order: [
                    ['nomeDisciplina', 'ASC']
                ],
                attributes: [
                    'id',
                    'nomeDisciplina',
                    'codigoDisciplina',
                    'semestre',
                    'periodo'
                ]
                }).then(disciplinas => {
                    res.render('impressao/editar', {impressao: impressao, professors: professors, disciplinas: disciplinas});
                });
            });
    });    
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const professorId = req.body.professorId;
    const disciplinaId = req.body.disciplinaId;
    const horarioDisciplina = req.body.horarioDisc;
    const diaSemanaDisciplina = req.body.diaSemanaDisc;
    const aulasDisciplina = req.body.aulasDisc;
    const hae = req.body.hae;
    const haec = req.body.haec;
    const anoImpressao = new Date();

    Impressao.update({
        professorId: professorId,
        disciplinaId: disciplinaId,
        IdDisciplina1: disciplinaId,
        horarioDisc1: horarioDisciplina,
        diaSemanaDisc1: diaSemanaDisciplina,
        aulasDisc1: aulasDisciplina,
        hae: hae,
        haec: haec,
        anoImpressao: anoImpressao
    },
    {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/impressaos');
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Impressao.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/impressaos');
    });
}