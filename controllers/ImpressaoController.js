const { DATEONLY } = require('sequelize');
const Curso = require('../models/curso');
const Disciplina = require('../models/disciplina');
const Feriado = require('../models/feriado');
const Impressao = require('../models/impressao');
const Professor = require('../models/professor');
const {DataParaImpressao, FeriadoOuDomingo, HoraParaImpressao} = require('../utilidades');
var qtdDeDisciplinasGlobal=0;

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
   let formataHorarioAula = 0;
   let horarioFormatado = 0;

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
            horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
            inicioManha[day] = horarioFormatado;
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
            horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'))
            inicioTarde[day] = horarioFormatado;
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
            horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':')); 
            inicioNoite[day] = horarioFormatado;
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
            res.render('impressao/pagina', {impressao: impressao, nomeDisciplina1, curso1, ha, mesSelecionado, dayOfWeek, inicioManha, aulasManha, haeManha, rubricaManha, inicioTarde, aulasTarde, haeTarde, rubricaTarde, inicioNoite, aulasNoite, haeNoite, rubricaNoite, diasMes, qtdDiasMes, ano});
        });
    });
    });
    });
}


exports.renderNovo = (req, res, next) => {
    const msgHorarioInvalido = req.query.msgHorarioInvalido;

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
                res.render('impressao/novo', {professors: professors, disciplinas: disciplinas, msgHorarioInvalido});
            });
        });
}

exports.create = (req, res, next) => {
    const professorId = req.body.professorId;
    const disciplinaId = req.body.disciplinaId;
    const horarioDisciplina = req.body.horarioDisc;
    const diaSemanaDisciplina = req.body.diaSemanaDisc;
    const aulasDisciplina = req.body.aulasDisc;
    const disciplinaId2 = req.body.disciplinaId2;
    const horarioDisciplina2 = req.body.horarioDisc2;
    const diaSemanaDisciplina2 = req.body.diaSemanaDisc2;
    const aulasDisciplina2 = req.body.aulasDisc2;
    const disciplinaId3 = req.body.disciplinaId3;
    const horarioDisciplina3 = req.body.horarioDisc3;
    const diaSemanaDisciplina3 = req.body.diaSemanaDisc3;
    const aulasDisciplina3 = req.body.aulasDisc3;
    const disciplinaId4 = req.body.disciplinaId4;
    const horarioDisciplina4 = req.body.horarioDisc4;
    const diaSemanaDisciplina4 = req.body.diaSemanaDisc4;
    const aulasDisciplina4 = req.body.aulasDisc4;
    const disciplinaId5 = req.body.disciplinaId5;
    const horarioDisciplina5 = req.body.horarioDisc5;
    const diaSemanaDisciplina5 = req.body.diaSemanaDisc5;
    const aulasDisciplina5 = req.body.aulasDisc5;
    const disciplinaId6 = req.body.disciplinaId6;
    const horarioDisciplina6 = req.body.horarioDisc6;
    const diaSemanaDisciplina6 = req.body.diaSemanaDisc6;
    const aulasDisciplina6 = req.body.aulasDisc6;
    const disciplinaId7 = req.body.disciplinaId7;
    const horarioDisciplina7 = req.body.horarioDisc7;
    const diaSemanaDisciplina7 = req.body.diaSemanaDisc7;
    const aulasDisciplina7 = req.body.aulasDisc7;
    const disciplinaId8 = req.body.disciplinaId8;
    const horarioDisciplina8 = req.body.horarioDisc8;
    const diaSemanaDisciplina8 = req.body.diaSemanaDisc8;
    const aulasDisciplina8 = req.body.aulasDisc8;
    const disciplinaId9 = req.body.disciplinaId9;
    const horarioDisciplina9 = req.body.horarioDisc9;
    const diaSemanaDisciplina9 = req.body.diaSemanaDisc9;
    const aulasDisciplina9 = req.body.aulasDisc9;
    const disciplinaId10 = req.body.disciplinaId10;
    const horarioDisciplina10 = req.body.horarioDisc10;
    const diaSemanaDisciplina10 = req.body.diaSemanaDisc10;
    const aulasDisciplina10 = req.body.aulasDisc10;
    const hae = req.body.hae;
    const haec = req.body.haec;
    const anoImpressao = new Date();
    let msgOK = '1';
    let msgNOK = '0';
    let msgHorarioInvalido = '1';
    let horarioOk = false;
    let verificaHorarioDisciplina = 0; //Verifica se o horário da disciplina está dentro do período correto 
    console.log(horarioDisciplina2);

    Disciplina.findOne({
        where:{
            Id : disciplinaId 
        }
    }). then(disciplina => {
       /*verificaHorarioDisciplina = parseInt(horarioDisciplina.split(":")[0]);
        if(disciplina.periodo == 'Manhã' && (verificaHorarioDisciplina < 6 || verificaHorarioDisciplina > 13)){
            horarioOk = false;
        }
        else if (disciplina.periodo == 'Tarde' && (verificaHorarioDisciplina < 13 || verificaHorarioDisciplina > 19)){
            horarioOk = false;
        }
        else if (disciplina.periodo == 'Noite' && (verificaHorarioDisciplina < 19 || verificaHorarioDisciplina > 23)){
            horarioOk = false;
        }
        else{
            horarioOk = true;
        }
        console.log(horarioOk);*/
        
        
    Impressao.findOne({
        where: {
            professorId : professorId
        }
    }).then(impressao => {
        console.log(!horarioOk);
        if(impressao == undefined)//if(impressao == undefined && (horarioOk)) se for checar horário
        {
            Impressao.create({
                professorId: professorId,
                disciplinaId: disciplinaId,
                idDisciplina1: disciplinaId,
                horarioDisc1: horarioDisciplina,
                diaSemanaDisc1: diaSemanaDisciplina,
                aulasDisc1: aulasDisciplina,
                idDisciplina2: disciplinaId2,
                horarioDisc2: horarioDisciplina2,
                diaSemanaDisc2: diaSemanaDisciplina2,
                aulasDisc2: aulasDisciplina2,
                idDisciplina3: disciplinaId3,
                horarioDisc3: horarioDisciplina3,
                diaSemanaDisc3: diaSemanaDisciplina3,
                aulasDisc3: aulasDisciplina3,
                idDisciplina4: disciplinaId4,
                horarioDisc4: horarioDisciplina4,
                diaSemanaDisc4: diaSemanaDisciplina4,
                aulasDisc4: aulasDisciplina4,
                idDisciplina5: disciplinaId5,
                horarioDisc5: horarioDisciplina5,
                diaSemanaDisc5: diaSemanaDisciplina5,
                aulasDisc5: aulasDisciplina5,
                idDisciplina6: disciplinaId6,
                horarioDisc6: horarioDisciplina6,
                diaSemanaDisc6: diaSemanaDisciplina6,
                aulasDisc6: aulasDisciplina6,
                idDisciplina7: disciplinaId7,
                horarioDisc7: horarioDisciplina7,
                diaSemanaDisc7: diaSemanaDisciplina7,
                aulasDisc7: aulasDisciplina7,
                idDisciplina8: disciplinaId8,
                horarioDisc8: horarioDisciplina8,
                diaSemanaDisc8: diaSemanaDisciplina8,
                aulasDisc8: aulasDisciplina8,
                idDisciplina9: disciplinaId9,
                horarioDisc9: horarioDisciplina9,
                diaSemanaDisc9: diaSemanaDisciplina9,
                aulasDisc9: aulasDisciplina9,
                idDisciplina10: disciplinaId10,
                horarioDisc10: horarioDisciplina10,
                diaSemanaDisc10: diaSemanaDisciplina10,
                aulasDisc10: aulasDisciplina10,
                hae: hae,
                haec: haec,
                anoImpressao: anoImpressao,
                
            }).then(() => {
                res.redirect('/impressaos/?msgOK=' + msgOK);
            })
        }
        /*else if (impressao == undefined && (!horarioOk))
        {
            res.redirect('/impressaos/novo/?msgHorarioInvalido=' + msgHorarioInvalido);
        }*/
        else{
            res.redirect('/impressaos/?msgNOK=' + msgNOK);
        }
    })    
    })
}

exports.renderEditar = (req, res, next) => {
    const id = req.params.id;

    Impressao.findOne({
            where: {
                id: id
            },
            include: [
                {
                model: Professor
                }
            ]
        }).then(impressao => {
            let qtdDisciplinas = 0;
            //Verifica quantas disciplinas foram adicionadas para poder editar
                if(impressao.idDisciplina2 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina3 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina4 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina5 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina6 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina7 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina8 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina9 != null){
                    qtdDisciplinas++;
                }
                if(impressao.idDisciplina10 != null){
                    qtdDisciplinas++;
                }
                qtdDeDisciplinasGlobal = qtdDisciplinas;
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
                    res.render('impressao/editar', {impressao: impressao, disciplinas: disciplinas, qtdDisciplinas});
                });
            });  
}

exports.update = (req, res, next) => {
    const id = req.body.id;
    const disciplinaId = req.body.disciplinaId;
    const horarioDisciplina = req.body.horarioDisc;
    const diaSemanaDisciplina = req.body.diaSemanaDisc;
    const aulasDisciplina = req.body.aulasDisc;
    const disciplinaId2 = req.body.disciplinaId2;
    const horarioDisciplina2 = req.body.horarioDisc2;
    const diaSemanaDisciplina2 = req.body.diaSemanaDisc2;
    const aulasDisciplina2 = req.body.aulasDisc2;
    const disciplinaId3 = req.body.disciplinaId3;
    const horarioDisciplina3 = req.body.horarioDisc3;
    const diaSemanaDisciplina3 = req.body.diaSemanaDisc3;
    const aulasDisciplina3 = req.body.aulasDisc3;
    const disciplinaId4 = req.body.disciplinaId4;
    const horarioDisciplina4 = req.body.horarioDisc4;
    const diaSemanaDisciplina4 = req.body.diaSemanaDisc4;
    const aulasDisciplina4 = req.body.aulasDisc4;
    const disciplinaId5 = req.body.disciplinaId5;
    const horarioDisciplina5 = req.body.horarioDisc5;
    const diaSemanaDisciplina5 = req.body.diaSemanaDisc5;
    const aulasDisciplina5 = req.body.aulasDisc5;
    const disciplinaId6 = req.body.disciplinaId6;
    const horarioDisciplina6 = req.body.horarioDisc6;
    const diaSemanaDisciplina6 = req.body.diaSemanaDisc6;
    const aulasDisciplina6 = req.body.aulasDisc6;
    const disciplinaId7 = req.body.disciplinaId7;
    const horarioDisciplina7 = req.body.horarioDisc7;
    const diaSemanaDisciplina7 = req.body.diaSemanaDisc7;
    const aulasDisciplina7 = req.body.aulasDisc7;
    const disciplinaId8 = req.body.disciplinaId8;
    const horarioDisciplina8 = req.body.horarioDisc8;
    const diaSemanaDisciplina8 = req.body.diaSemanaDisc8;
    const aulasDisciplina8 = req.body.aulasDisc8;
    const disciplinaId9 = req.body.disciplinaId9;
    const horarioDisciplina9 = req.body.horarioDisc9;
    const diaSemanaDisciplina9 = req.body.diaSemanaDisc9;
    const aulasDisciplina9 = req.body.aulasDisc9;
    const disciplinaId10 = req.body.disciplinaId10;
    const horarioDisciplina10 = req.body.horarioDisc10;
    const diaSemanaDisciplina10 = req.body.diaSemanaDisc10;
    const aulasDisciplina10 = req.body.aulasDisc10;
    const hae = req.body.hae;
    const haec = req.body.haec;
    const anoImpressao = new Date();
    let msgOK = '1';
    let msgNOK = '0';

    Impressao.update({
        disciplinaId: disciplinaId,
        idDisciplina1: disciplinaId,
        horarioDisc1: horarioDisciplina,
        diaSemanaDisc1: diaSemanaDisciplina,
        aulasDisc1: aulasDisciplina,
        idDisciplina2: disciplinaId2,
        horarioDisc2: horarioDisciplina2,
        diaSemanaDisc2: diaSemanaDisciplina2,
        aulasDisc2: aulasDisciplina2,
        idDisciplina3: disciplinaId3,
        horarioDisc3: horarioDisciplina3,
        diaSemanaDisc3: diaSemanaDisciplina3,
        aulasDisc3: aulasDisciplina3,
        idDisciplina4: disciplinaId4,
        horarioDisc4: horarioDisciplina4,
        diaSemanaDisc4: diaSemanaDisciplina4,
        aulasDisc4: aulasDisciplina4,
        idDisciplina5: disciplinaId5,
        horarioDisc5: horarioDisciplina5,
        diaSemanaDisc5: diaSemanaDisciplina5,
        aulasDisc5: aulasDisciplina5,
        idDisciplina6: disciplinaId6,
        horarioDisc6: horarioDisciplina6,
        diaSemanaDisc6: diaSemanaDisciplina6,
        aulasDisc6: aulasDisciplina6,
        idDisciplina7: disciplinaId7,
        horarioDisc7: horarioDisciplina7,
        diaSemanaDisc7: diaSemanaDisciplina7,
        aulasDisc7: aulasDisciplina7,
        idDisciplina8: disciplinaId8,
        horarioDisc8: horarioDisciplina8,
        diaSemanaDisc8: diaSemanaDisciplina8,
        aulasDisc8: aulasDisciplina8,
        idDisciplina9: disciplinaId9,
        horarioDisc9: horarioDisciplina9,
        diaSemanaDisc9: diaSemanaDisciplina9,
        aulasDisc9: aulasDisciplina9,
        idDisciplina10: disciplinaId10,
        horarioDisc10: horarioDisciplina10,
        diaSemanaDisc10: diaSemanaDisciplina10,
        aulasDisc10: aulasDisciplina10,
        hae: hae,
        haec: haec,
        anoImpressao: anoImpressao,
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