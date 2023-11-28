const { DATEONLY } = require('sequelize');
const Curso = require('../models/curso');
const Disciplina = require('../models/disciplina');
const Feriado = require('../models/feriado');
const Impressao = require('../models/impressao');
const Professor = require('../models/professor');
const {DataParaImpressao, FeriadoOuDomingo} = require('../utilidades');


exports.getAll = (req, res, next) => {
    const msgOK = req.query.msgOK;
    const msgNOK = req.query.msgNOK;

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
        res.render('impressao/index', {impressaos: impressaos, msgOK, msgNOK});
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

exports.renderSelecionaMes = (req, res, next) => {
    const id = req.params.id;
    console.log("t1"+id);
    res.render('impressao/selecionarMes', {id: id});
}

/*exports.selecionarMes = (req, res, next) => {
    const id = req.params.id;
    const mes = req.body.mes;
    console.log("t"+id);
    res.redirect('/impressao/gerarRegistro/?id=' + id + '/?mes=' + mes);

}*/

exports.renderGeraRegistro = (req, res, next) => {
    const id = req.params.id;
    const mesSelecionado = req.body.mes;
    const anoSelecionado = req.body.ano;
    let nomeDisciplina1 = null;
    let curso1 = null;
    let ha = null;
    let periodo = null;
    let dayOfWeek =new Array(31);
    let inicioManha =new Array(31);
    let aulasManha =new Array(31);
    let haeManha =new Array(31);
    let rubricaManha =new Array(31);
    let inicioTarde =new Array(31);
    let aulasTarde =new Array(31);
    let haeTarde =new Array(31);
    let rubricaTarde =new Array(31);
    let inicioNoite =new Array(31);
    let aulasNoite =new Array(31);
    let haeNoite =new Array(31);
    let rubricaNoite =new Array(31);
    let diasMes = new Array(31).fill('');
    let qtdDiasMes = 0;
    
    
  
//Data para prencher tabela 
   let mesAno = DataParaImpressao(mesSelecionado, anoSelecionado);
   let startDate = new Date(mesAno + "-01");
   let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
   let data = null;
   let mes = mesAno.substring(5,8);
   let ano = mesAno.substring(0,4);

    Impressao.findOne({
        where: {
            id: id
        },
        include: [
            {
                model: Disciplina
            },
            {
                model: Professor
            }
        ]
        }).then(impressao => {
            ha = ((impressao.aulasDisc1)/2);

            Disciplina.findByPk(impressao.idDisciplina1).then(disciplina => {
            nomeDisciplina1 = disciplina.nomeDisciplina;
            periodo = disciplina.periodo;

            Curso.findByPk(disciplina.cursoId).then(curso => {
            curso1 = curso.nomeCurso;


        Feriado.findAll({
            order:[
            ['nomeFeriado', 'ASC']
        ]    
        }).then(feriados =>{
    
              // Loop para preencher os dias do mês
    for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
        let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), day);
        dayOfWeek[day] = currentDate.toLocaleDateString('pt-br',  { weekday: 'short' });
        diasMes[day] = day;
        qtdDiasMes +=1;
        

// Função para preencher as colunas 
    if (dayOfWeek[day] == impressao.diaSemanaDisc1) {
        if (periodo == "Manhã"){
            inicioManha[day] = impressao.horarioDisc1;
            aulasManha[day] = impressao.aulasDisc1;
            haeManha[day] = impressao.hae;
            if (dayOfWeek[day] == 'dom.'){
                rubricaManha[day] = "DOMINGO";
                rubricaTarde[day] = "DOMINGO";
                rubricaNoite[day] = "DOMINGO"; 
            }
            else{ 
                rubricaManha[day] = " ";
                rubricaTarde[day] = " ";
                rubricaNoite[day] = " "; 
            }

        }
        else if (periodo == "Tarde"){
            inicioTarde[day] = impressao.horarioDisc1;
            aulasTarde[day] = impressao.aulasDisc1;
            haeTarde[day] = impressao.hae;
            if (dayOfWeek[day] == 'dom.'){
                rubricaManha[day] = "DOMINGO";
                rubricaTarde[day] = "DOMINGO";
                rubricaNoite[day] = "DOMINGO"; 
            }
            else{ 
                rubricaManha[day] = " ";
                rubricaTarde[day] = " ";
                rubricaNoite[day] = " "; 
            } 
        }
        else{
            inicioNoite[day] = impressao.horarioDisc1;
            aulasNoite[day] = impressao.aulasDisc1;
            haeNoite[day] = impressao.hae;
            if (dayOfWeek[day] == 'dom.'){
                rubricaManha[day] = "DOMINGO";
                rubricaTarde[day] = "DOMINGO";
                rubricaNoite[day] = "DOMINGO"; 
            }
            else{ 
                rubricaManha[day] = " ";
                rubricaTarde[day] = " ";
                rubricaNoite[day] = " "; 
            }
        }
            
    }
    else{
        inicioManha[day] = null;
        aulasManha[day] = null;
        haeManha[day] = null;  
        if (dayOfWeek[day] == 'dom.'){
            rubricaManha[day] = "DOMINGO";
            rubricaTarde[day] = "DOMINGO";
            rubricaNoite[day] = "DOMINGO"; 
        }
        else{
            rubricaManha[day] = " - ";
            rubricaTarde[day] = " - ";
            rubricaNoite[day] = " - "; 
        }
        inicioTarde[day] = null;
        aulasTarde[day] = null;
        haeTarde[day] = null;
        inicioNoite[day] = null;
        aulasNoite[day] = null;
        haeNoite[day] = null;
    }
    if(day<10){data = (mes + '-' + 0 +day); }
        else {data = (mes + '-' +day);}
            feriados.forEach(feriado=>{
                formataDataFeriado = feriado.dataFeriado.substring(5,10);              
            if(formataDataFeriado == data){
            rubricaManha[day] = "Feriado " + feriado.tipo;
            rubricaTarde[day] = "Feriado "+ feriado.tipo;
            rubricaNoite[day] = "Feriado "+ feriado.tipo;
            }
        })

}

// Função para verificar se é feriado
function eFeriadoOuDomingo(diaDaSemana, dia, mesAno) {
    /*const ano = mesAno.substr(0,4);
    const mes = mesAno.substr(5,2);
    const data = (ano+ '-' + mes + '-' +dia);

   Feriado. findOne({
        where:{
            dataFeriado: data
        }
    }). then(feriado => {
        if(feriado == undefined) {
            {
                 return '';
            }    
        }
        else {          
           return {fereiado:eriado};
        }
        
    });
    console.log(feriado.hasOwnProperty(0))
    if (feriado != Object){
        feriadoOuDomingo = 'FERIADO';
        return true;
    }
*/
    if (diaDaSemana == 'dom.')
    {
        feriadoOuDomingo = 'DOMINGO'
        return true;
    }   
    
}
            
            res.render('impressao/pagina', {impressao: impressao, nomeDisciplina1, curso1, ha, mesSelecionado, dayOfWeek, inicioManha, aulasManha, haeManha, rubricaManha, inicioTarde, aulasTarde, haeTarde, rubricaTarde, inicioNoite, aulasNoite, haeNoite, rubricaNoite, diasMes, qtdDiasMes});
        });
    });
    });
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
    let msgOK = '1';
    let msgNOK = '0';
    
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
                anoImpressao: anoImpressao,
                idDisciplina1: disciplinaId
            }).then(() => {
                res.redirect('/impressaos/?msgOK=' + msgOK);
            })
        }
        else
        {
            res.redirect('/impressaos/?msgNOK=' + msgNOK);
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
    let msgOK = '1';
    let msgNOK = '0';

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
        res.redirect('/impressaos/?msgOK=' + msgOK);
    });
}

exports.delete = (req, res) => {
    const id = req.params.id;
    let msgOK = '1';
    let msgNOK = '0';

    Impressao.destroy({
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/impressaos/?msgOK=' + msgOK);
    });
}