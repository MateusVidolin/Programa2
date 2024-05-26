const { DATEONLY } = require('sequelize');
const Curso = require('../models/curso');
const Disciplina = require('../models/disciplina');
const Feriado = require('../models/feriado');
const Impressao = require('../models/impressao');
const Professor = require('../models/professor');
const fs = require('fs');
const {jsPDF} = require('jspdf');
const autotable = require('jspdf-autotable');
const os = require('os');
const path = require('path'); // Adicionando a importação do módulo 'path'
const {DataParaImpressao, FeriadoOuDomingo, HoraParaImpressao} = require('../utilidades');



exports.getAll = (req, res, next) => {
    const msgOK = req.query.msgOK;
    const msgNOK = req.query.msgNOK;
    let nomeDisciplinasAtribuidas = [];
    let posiDisciplinaAtual = 0;

    Impressao.findAll({
        order: [
            ['id', 'ASC']
        ],
        include: [
            {model: Disciplina, as:'IdDisciplina1', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina2', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina3', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina4', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina5', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina6', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina7', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina8', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina9', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina10', attributes: ['nomeDisciplina']}

        ,{
            model: Professor
        }]
    }).then(impressaos => {
                    impressaos.sort((a, b) => {
                        if (a.professor.nome < b.professor.nome) {
                            return -1;
                        }
                        if (a.professor.nome > b.professor.nome) {
                            return 1;
                        }
                        return 0;
                    });
                    const nomesMateriasAtribuidas = impressaos.map(impressao => {
                        return{
                            id: impressao.id,
                            disciplinas: [
                                impressao.IdDisciplina1 ? impressao.IdDisciplina1.nomeDisciplina: null,
                                impressao.IdDisciplina2 ? impressao.IdDisciplina2.nomeDisciplina: null,
                                impressao.IdDisciplina3 ? impressao.IdDisciplina3.nomeDisciplina: null,
                                impressao.IdDisciplina4 ? impressao.IdDisciplina4.nomeDisciplina: null,
                                impressao.IdDisciplina5 ? impressao.IdDisciplina5.nomeDisciplina: null,
                                impressao.IdDisciplina6 ? impressao.IdDisciplina6.nomeDisciplina: null,
                                impressao.IdDisciplina7 ? impressao.IdDisciplina7.nomeDisciplina: null,
                                impressao.IdDisciplina8 ? impressao.IdDisciplina8.nomeDisciplina: null,
                                impressao.IdDisciplina9 ? impressao.IdDisciplina9.nomeDisciplina: null,
                                impressao.IdDisciplina10 ? impressao.IdDisciplina10.nomeDisciplina: null,
                            ],
                        };
                    })
        
        res.render('impressao/index', {impressaos: impressaos, nomeDisciplinasAtribuidas, nomesMateriasAtribuidas, posiDisciplinaAtual, msgOK, msgNOK});
    });
}


exports.renderSelecionaMes = (req, res, next) => {
    const id = req.params.id;
    res.render('impressao/selecionarMes', {id: id});
}

exports.renderSelecionaMesTodos = (req, res, next) => {
    res.render('impressao/selecionarMesTodos');
}


exports.renderGeraRegistroTodos =async (req, res, next) =>{
    //const id = req.params.id;
    const mesSelecionado = req.body.mes;
    const anoSelecionado = req.body.ano;
    let nomeDisciplina = new Array(10);
    let nomeCursosAtribuidos = new Array(10);
    let ha = null;
    let hae = null;
    let haec = null;
    let periodoDisciplina = new Array(10);
    let idCursoDisciplinas = new Array(10);
    let verificaNomeCursoRepetido = null;
    let abreviacaoNomeCurso = null;
    let dayOfWeek =new Array(31);
    let inicioManha =new Array(31).fill(null);
    let aulasManha =new Array(31);
    let haeManha =new Array(31).fill(null);
    let haecManha =new Array(31).fill(null);
    let rubricaManha =new Array(31);
    let inicioTarde =new Array(31).fill(null);
    let aulasTarde =new Array(31);
    let haeTarde =new Array(31).fill(null);
    let haecTarde =new Array(31).fill(null);
    let rubricaTarde =new Array(31);
    let inicioNoite =new Array(31).fill(null);
    let aulasNoite =new Array(31);
    let haeNoite =new Array(31).fill(null);
    let haecNoite =new Array(31).fill(null);
    let rubricaNoite =new Array(31);
    let diasMes = new Array(31).fill('');
    let qtdDiasMes = 0;
    let totalAulas = 0;
    let totalDeDisciplinas=1;
    let auxPosVazia = 0;
    const preposicoes = ['de', 'e', 'do', 'da', 'dos', 'das', 'com', 'para'];
    let palavrasSignificativas = null;
    let verificaPeriodoHae = null;
    let verificaPeriodoHaec = null;
    // Criando um novo documento jsPDF
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
});
  
//Data para prencher tabela 
   let mesAno = DataParaImpressao(mesSelecionado, anoSelecionado);
   let startDate = new Date(mesAno + "-01");
   let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
   let data = null;
   let mes = mesAno.substring(5,8);
   let ano = mesAno.substring(0,4);
   let horarioFormatado = 0;

   Impressao.findAll({
    include: [
        {model: Disciplina, as:'IdDisciplina1', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina2', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina3', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina4', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina5', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina6', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina7', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina8', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina9', attributes: ['nomeDisciplina']},
        {model: Disciplina, as:'IdDisciplina10', attributes: ['nomeDisciplina']}
    ,{
        model: Professor
    }]
    
}).then(impressaos => {
    impressaos.forEach(impressao=>{
        console.log('!!!!!!!!!!foi findALL' + impressao.id)  
            if(impressao.idDisciplina10!=null){
                Disciplina.findByPk(impressao.idDisciplina10).then(disciplina => {
                    nomeDisciplina[10] = disciplina.nomeDisciplina;
                    periodoDisciplina[10] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc10;
                    idCursoDisciplinas[10] = disciplina.cursoId;

                })
            }
            if(impressao.idDisciplina9!=null){
                Disciplina.findByPk(impressao.idDisciplina9).then(disciplina => {
                    nomeDisciplina[9]= disciplina.nomeDisciplina;
                    periodoDisciplina[9] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc9;
                    idCursoDisciplinas[9] = disciplina.cursoId;
                }) 
            }       
            if(impressao.idDisciplina8!=null){
                Disciplina.findByPk(impressao.idDisciplina8).then(disciplina => {
                    nomeDisciplina[8] = disciplina.nomeDisciplina;
                    periodoDisciplina[8] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc8;
                    idCursoDisciplinas[8] = disciplina.cursoId;
                    })
            }
            if(impressao.idDisciplina7!=null){
                Disciplina.findByPk(impressao.idDisciplina7).then(disciplina => {
                    nomeDisciplina[7] = disciplina.nomeDisciplina;
                    periodoDisciplina[7] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc7;
                    idCursoDisciplinas[7] = disciplina.cursoId;
                })
            }
            if(impressao.idDisciplina6!=null){
                Disciplina.findByPk(impressao.idDisciplina6).then(disciplina => {
                    nomeDisciplina[6]= disciplina.nomeDisciplina;
                    periodoDisciplina[6] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc6;
                    idCursoDisciplinas[6] = disciplina.cursoId;
                }) 
            }       
            if(impressao.idDisciplina5!=null){
                Disciplina.findByPk(impressao.idDisciplina5).then(disciplina => {
                    nomeDisciplina[5] = disciplina.nomeDisciplina;
                    periodoDisciplina[5] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc5;
                    idCursoDisciplinas[5] = disciplina.cursoId;
                    })
            }
            if(impressao.idDisciplina4!=null){
                Disciplina.findByPk(impressao.idDisciplina4).then(disciplina => {
                    nomeDisciplina[4] = disciplina.nomeDisciplina;
                    periodoDisciplina[4] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc4;
                    idCursoDisciplinas[4] = disciplina.cursoId;
                    })
            }
            if(impressao.idDisciplina3!=null){
                Disciplina.findByPk(impressao.idDisciplina3).then(disciplina => {
                    nomeDisciplina[3] = disciplina.nomeDisciplina;
                    periodoDisciplina[3] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc3;
                    idCursoDisciplinas[3] = disciplina.cursoId;;
                })
            }
            if(impressao.idDisciplina2!=null){
                Disciplina.findByPk(impressao.idDisciplina2).then(disciplina => {
                    nomeDisciplina[2]= disciplina.nomeDisciplina;
                    periodoDisciplina[2] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc2;
                    idCursoDisciplinas[2] = disciplina.cursoId;
                }) 
            } 
            
                                 
            Disciplina.findByPk(impressao.idDisciplina1).then(disciplina => {
                console.log('!!!!!!!!!!foi findone' + impressao.idDisciplina1) 
            nomeDisciplina[1] = disciplina.nomeDisciplina;
            periodoDisciplina[1] = disciplina.periodo;
            idCursoDisciplinas[1] = disciplina.cursoId;
            ha += impressao.aulasDisc1;
            ha += ha/2;
            totalAulas = (impressao.aulasDisc1+impressao.aulasDisc2+impressao.aulasDisc3+impressao.aulasDisc4+impressao.aulasDisc5+impressao.aulasDisc6+impressao.aulasDisc7+impressao.aulasDisc8+impressao.aulasDisc9+impressao.aulasDisc10)
            hae = impressao.hae1 + impressao.hae2 + impressao.hae3 + impressao.hae4;
            haec = impressao.haec1 + impressao.haec2 + impressao.haec3 + impressao.haec4;
            Curso.findAll({
                
            }).then(cursos =>{
                //Verifica os cursos que estão atribuidos ao professor, abrevia o nome e envia para a página de impressão
                cursos.forEach(curso => {
                    for(var i=1; i<= totalDeDisciplinas; i++){
                        if(curso.id == idCursoDisciplinas[i]){
                            if (i == 1){
                            palavrasSignificativas = curso.nomeCurso.split(' ');
                            palavrasSignificativas = palavrasSignificativas.filter(palavrasSignificativas => !preposicoes.includes(palavrasSignificativas.toLowerCase()));
                            abreviacaoNomeCurso = palavrasSignificativas.map(palavra => palavra.charAt(0)).join('');
                            abreviacaoNomeCurso = abreviacaoNomeCurso.toUpperCase();
                            nomeCursosAtribuidos[i] = abreviacaoNomeCurso;
                            auxPosVazia = i+1;
                            }
                            else{
                                palavrasSignificativas = curso.nomeCurso.split(' ');
                                palavrasSignificativas = palavrasSignificativas.filter(palavrasSignificativas => !preposicoes.includes(palavrasSignificativas.toLowerCase()));
                                abreviacaoNomeCurso = palavrasSignificativas.map(palavra => palavra.charAt(0)).join('');
                                abreviacaoNomeCurso = abreviacaoNomeCurso.toUpperCase();
                                verificaNomeCursoRepetido = abreviacaoNomeCurso;
                                if (verificaNomeCursoRepetido != nomeCursosAtribuidos[auxPosVazia -1]){
                                    nomeCursosAtribuidos[auxPosVazia ] = abreviacaoNomeCurso;
                                    auxPosVazia = i+1;
                                }
                                else{
                                    auxPosVazia = i
                                }
                            }
                        }
                    }
                })



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
    if (dayOfWeek[day] == impressao.diaSemanaDisc1 || dayOfWeek[day] == impressao.diaSemanaDisc2 || dayOfWeek[day] == impressao.diaSemanaDisc3 || dayOfWeek[day] == impressao.diaSemanaDisc4 || dayOfWeek[day] == impressao.diaSemanaDisc5 || dayOfWeek[day] == impressao.diaSemanaDisc6 || dayOfWeek[day] == impressao.diaSemanaDisc7 || dayOfWeek[day] == impressao.diaSemanaDisc8 || dayOfWeek[day] == impressao.diaSemanaDisc9 || dayOfWeek[day] == impressao.diaSemanaDisc10 || dayOfWeek[day] == impressao.diaSemanaHae1 || dayOfWeek[day] == impressao.diaSemanaHae2 || dayOfWeek[day] == impressao.diaSemanaHae3 || dayOfWeek[day] == impressao.diaSemanaHae4 || dayOfWeek[day] == impressao.diaSemanaHaec1 || dayOfWeek[day] == impressao.diaSemanaHaec2 || dayOfWeek[day] == impressao.diaSemanaHaec3 || dayOfWeek[day] == impressao.diaSemanaHaec4) {

        if(periodoDisciplina[1]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc1){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
                inicioManha[day] = horarioFormatado;
                aulasManha[day] = impressao.aulasDisc1;
                  
            }
                else if(periodoDisciplina[2]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc2){
                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc2.split(':'));
                    inicioManha[day] = horarioFormatado;
                    aulasManha[day] = impressao.aulasDisc2;
                    haeManha[day] = impressao.hae;  
                }
                    else if(periodoDisciplina[3]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc3){
                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc3.split(':'));
                        inicioManha[day] = horarioFormatado;
                        aulasManha[day] = impressao.aulasDisc3;
                        haeManha[day] = impressao.hae;  
                    }
                        else if(periodoDisciplina[4]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc4){
                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc4.split(':'));
                            inicioManha[day] = horarioFormatado;
                            aulasManha[day] = impressao.aulasDisc4;
                            haeManha[day] = impressao.hae;  
                        }
                            else if(periodoDisciplina[5]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc5){
                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc5.split(':'));
                                inicioManha[day] = horarioFormatado;
                                aulasManha[day] = impressao.aulasDisc5;
                                haeManha[day] = impressao.hae;  
                            }
                                else if(periodoDisciplina[6]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc6){
                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc6.split(':'));
                                    inicioManha[day] = horarioFormatado;
                                    aulasManha[day] = impressao.aulasDisc6;
                                    haeManha[day] = impressao.hae;  
                                }
                                    else if(periodoDisciplina[7]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc7){
                                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc7.split(':'));
                                        inicioManha[day] = horarioFormatado;
                                        aulasManha[day] = impressao.aulasDisc7;
                                        haeManha[day] = impressao.hae;  
                                    }
                                        else if(periodoDisciplina[8]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc8){
                                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc8.split(':'));
                                            inicioManha[day] = horarioFormatado;
                                            aulasManha[day] = impressao.aulasDisc8;
                                            haeManha[day] = impressao.hae;  
                                        }
                                            else if(periodoDisciplina[9]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc9){
                                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc9.split(':'));
                                                inicioManha[day] = horarioFormatado;
                                                aulasManha[day] = impressao.aulasDisc9;
                                                haeManha[day] = impressao.hae;  
                                            }
                                                else if(periodoDisciplina[10]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc10){
                                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc10.split(':'));
                                                    inicioManha[day] = horarioFormatado;
                                                    aulasManha[day] = impressao.aulasDisc10;
                                                    haeManha[day] = impressao.hae;  
                                                }
        if(periodoDisciplina[1]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc1){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
                inicioTarde[day] = horarioFormatado;
                aulasTarde[day] = impressao.aulasDisc1;
                haeTarde[day] = impressao.hae;  
            }
                else if(periodoDisciplina[2]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc2){
                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc2.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    aulasTarde[day] = impressao.aulasDisc2;
                    haeTarde[day] = impressao.hae;  
                }
                    else if(periodoDisciplina[3]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc3){
                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc3.split(':'));
                        inicioTarde[day] = horarioFormatado;
                        aulasTarde[day] = impressao.aulasDisc3;
                        haeTarde[day] = impressao.hae;  
                    }
                        else if(periodoDisciplina[4]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc4){
                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc4.split(':'));
                            inicioTarde[day] = horarioFormatado;
                            aulasTarde[day] = impressao.aulasDisc4;
                            haeTarde[day] = impressao.hae;  
                        }
                            else if(periodoDisciplina[5]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc5){
                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc5.split(':'));
                                inicioTarde[day] = horarioFormatado;
                                aulasTarde[day] = impressao.aulasDisc5;
                                haeTarde[day] = impressao.hae;  
                            }
                                else if(periodoDisciplina[6]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc6){
                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc6.split(':'));
                                    inicioTarde[day] = horarioFormatado;
                                    aulasTarde[day] = impressao.aulasDisc6;
                                    haeTarde[day] = impressao.hae;  
                                }
                                    else if(periodoDisciplina[7]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc7){
                                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc7.split(':'));
                                        inicioTarde[day] = horarioFormatado;
                                        aulasTarde[day] = impressao.aulasDisc7;
                                        haeTarde[day] = impressao.hae;  
                                    }
                                        else if(periodoDisciplina[8]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc8){
                                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc8.split(':'));
                                            inicioTarde[day] = horarioFormatado;
                                            aulasTarde[day] = impressao.aulasDisc8;
                                            haeTarde[day] = impressao.hae;  
                                        }
                                            else if(periodoDisciplina[9]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc9){
                                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc9.split(':'));
                                                inicioTarde[day] = horarioFormatado;
                                                aulasTarde[day] = impressao.aulasDisc9;
                                                haeTarde[day] = impressao.hae;  
                                            }
                                                else if(periodoDisciplina[10]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc10){
                                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc10.split(':'));
                                                    inicioTarde[day] = horarioFormatado;
                                                    aulasTarde[day] = impressao.aulasDisc10;
                                                    haeTarde[day] = impressao.hae;  
                                                }
        if(periodoDisciplina[1]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc1){
            horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
            inicioNoite[day] = horarioFormatado;
            aulasNoite[day] = impressao.aulasDisc1;
            haeNoite[day] = impressao.hae;  
        }
            else if(periodoDisciplina[2]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc2){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc2.split(':'));
                inicioNoite[day] = horarioFormatado;
                aulasNoite[day] = impressao.aulasDisc2;
                haeNoite[day] = impressao.hae;  
            }
                else if(periodoDisciplina[3]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc3){
                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc3.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    aulasNoite[day] = impressao.aulasDisc3;
                    haeNoite[day] = impressao.hae;  
                }
                    else if(periodoDisciplina[4]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc4){
                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc4.split(':'));
                        inicioNoite[day] = horarioFormatado;
                        aulasNoite[day] = impressao.aulasDisc4;
                        haeNoite[day] = impressao.hae;  
                    }
                        else if(periodoDisciplina[5]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc5){
                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc5.split(':'));
                            inicioNoite[day] = horarioFormatado;
                            aulasNoite[day] = impressao.aulasDisc5;
                            haeNoite[day] = impressao.hae;  
                        }
                            else if(periodoDisciplina[6]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc6){
                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc6.split(':'));
                                inicioNoite[day] = horarioFormatado;
                                aulasNoite[day] = impressao.aulasDisc6;
                                haeNoite[day] = impressao.hae;  
                            }
                                else if(periodoDisciplina[7]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc7){
                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc7.split(':'));
                                    inicioNoite[day] = horarioFormatado;
                                    aulasNoite[day] = impressao.aulasDisc7;
                                    haeNoite[day] = impressao.hae;  
                                }
                                    else if(periodoDisciplina[8]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc8){
                                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc8.split(':'));
                                        inicioNoite[day] = horarioFormatado;
                                        aulasNoite[day] = impressao.aulasDisc8;
                                        haeNoite[day] = impressao.hae;  
                                    }
                                        else if(periodoDisciplina[9]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc9){
                                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc9.split(':'));
                                            inicioNoite[day] = horarioFormatado;
                                            aulasNoite[day] = impressao.aulasDisc9;
                                            haeNoite[day] = impressao.hae;  
                                        }
                                            else if(periodoDisciplina[10]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc10){
                                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc10.split(':'));
                                                inicioNoite[day] = horarioFormatado;
                                                aulasNoite[day] = impressao.aulasDisc10;
                                                haeNoite[day] = impressao.hae;  
                                            }
            if (dayOfWeek[day] == 'dom.'){
                rubricaManha[day] = "DOMINGO";
                rubricaTarde[day] = "DOMINGO";
                rubricaNoite[day] = "DOMINGO"; 
            }
            
            //Preencher hae e haec

          else  if(dayOfWeek[day] == impressao.diaSemanaHae1){
                verificaPeriodoHae = impressao.horarioHae1.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae1.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae1;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae1.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae1;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae1.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae1;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHae2){
                verificaPeriodoHae = impressao.horarioHae2.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae2.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae2;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae2.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae2;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae2.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae2;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHae3){
                verificaPeriodoHae = impressao.horarioHae3.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae3.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae3;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae3.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae3;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae3.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae3;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHae4){
                verificaPeriodoHae = impressao.horarioHae4.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae4.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae4;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae4.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae4;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae4.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae4;
                }
            }
            if(dayOfWeek[day] == impressao.diaSemanaHaec1){
                verificaPeriodoHaec = impressao.horarioHaec1.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec1.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec1;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec1.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec1;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec1.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec1;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHaec2){
                verificaPeriodoHaec = impressao.horarioHaec2.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec2.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec2;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec2.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec2;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec2.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec2;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHaec3){
                verificaPeriodoHaec = impressao.horarioHaec3.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec3.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec3;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec3.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec3;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec3.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec3;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHaec4){
                verificaPeriodoHaec = impressao.horarioHaec4.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec4.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec4;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec4.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec4;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec4.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec4;
                }
            }
            
                if(inicioManha[day] == null && haeManha[day] == null && haecManha[day] == null ){
                    rubricaManha[day] = " - ";
                }
                else{
                    rubricaManha[day] = " ";
                } 
                if(inicioTarde[day] == null && haeTarde[day] == null && haecTarde[day] == null){
                    rubricaTarde[day] = " - ";
                }
                else{
                    rubricaTarde[day] = " ";
                }
                if(inicioNoite[day] == null && haeNoite[day] == null && haecNoite[day] == null){
                    rubricaNoite[day] = " - ";
                }
                else{
                    rubricaNoite[day] = " ";
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
    
    //Preencher feriado
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



console.log('comeceipdf')
// Adicionando cabeçalho
    doc.setFont('times', 'bold'); // Define a fonte e estilo (negrito)
      doc.setFontSize(10); // Define o tamanho da fonte
  doc.text(`FATEC MOGI MIRIM  -  REGISTRO DE PRESENÇA DE DOCENTE - ${mesSelecionado}/ ${ano}`, 80, 5);
  doc.setFont('times', 'normal'); // Define a fonte e estilo (negrito)
  doc.setFontSize(9); // Define o tamanho da fonte
  // Desenha uma linha separadora
  doc.setLineWidth(0.25); // Define a largura da linha
  doc.line(10, 7, 290, 7); // Desenha a linha de (10, 25) a (pageWidth - 210, 25)

  // Adicionando informações do professor com formatação
doc.setFont('times', 'bold');
doc.text('Professor - Reg.: ', 10, 12);
doc.setFont('times', 'normal');
doc.text(' ' + impressao.professor.numeroRegistro, doc.getTextWidth('Professor - Reg.: ') + 10, 12);

const posAfterNumeroRegistro = doc.getTextWidth(`Professor - Reg.: ${impressao.professor.numeroRegistro}`) + 20;
doc.setFont('times', 'bold');
doc.text(' Nome: ', posAfterNumeroRegistro, 12);
doc.setFont('times', 'normal');
doc.text(impressao.professor.nome, posAfterNumeroRegistro + doc.getTextWidth(' Nome: '), 12);

const posAfterNome = posAfterNumeroRegistro + doc.getTextWidth(` Nome: ${impressao.professor.nome}`)+50;
doc.setFont('times', 'bold');
doc.text(' Categoria: ', posAfterNome, 12);
doc.setFont('times', 'normal');
doc.text(' ' + impressao.professor.categoria, posAfterNome + doc.getTextWidth(' Categoria: '), 12);

const posAfterCategoria = posAfterNome + doc.getTextWidth(` Categoria: ${impressao.professor.categoria}`)+50;
doc.setFont('times', 'bold');
doc.text(' Curso:', posAfterCategoria, 12);
doc.setFont('times', 'normal');
doc.text('', posAfterCategoria + doc.getTextWidth(' Curso: '), 12);

const posAfterCurso = posAfterCategoria + doc.getTextWidth('Curso: ') ;
let offsetpos = 0;
nomeCursosAtribuidos.forEach(curso => {
doc.text(' ' + curso + '/', posAfterCurso + offsetpos, 12);
offsetpos += 8
});

doc.setFont('times', 'bold');
doc.text(`Disciplinas: `, 10, 17);
let offsetposDisciplina = 26;
doc.setFont('times', 'normal');
nomeDisciplina.forEach(disciplina => {
doc.text(' ' + disciplina + '/', offsetposDisciplina, 17);
offsetposDisciplina += doc.getTextWidth(`${disciplina}`) + 3;
});


 
doc.setFont('times', 'bold');
doc.text('Aulas: ', 10, 22);
doc.setFont('times', 'normal');
doc.text(`${totalAulas}`, doc.getTextWidth('Aulas: ') + 10, 22);

const posAfterAulas = doc.getTextWidth(`Aulas: ${totalAulas}`) + 40;
doc.setFont('times', 'bold');
doc.text(' H.A: ', posAfterAulas, 22);
doc.setFont('times', 'normal');
doc.text(`${ha}`, posAfterAulas + doc.getTextWidth(' H.A: '), 22);

const posAfterHA = posAfterAulas + doc.getTextWidth(` H.A: ${ha}`)+40;
doc.setFont('times', 'bold');
doc.text(' H.A.E: ', posAfterHA, 22);
doc.setFont('times', 'normal');
doc.text(`${hae}`, posAfterHA + doc.getTextWidth(' H.A.E: '), 22);

const posAfterHAE = posAfterHA + doc.getTextWidth(` H.A.E: ${hae}`)+40;
doc.setFont('times', 'bold');
doc.text(' H.A.E.C:', posAfterHAE, 22);
doc.setFont('times', 'normal');
doc.text(`${haec}`, posAfterHAE + doc.getTextWidth(' H.A.E.C: '), 22);
  
const posAfterHAEC = posAfterHAE + doc.getTextWidth(` Jornada:`)+40;
doc.setFont('times', 'bold');
doc.text(' Jornada:', posAfterHAEC, 22);


// Definindo a posição inicial da tabela
const startY = 24; // Posição Y inicial abaixo do cabeçalho

// Adicionando dados à tabela
const tableData = []
for (let day = 1; day <= qtdDiasMes; day++) {
    const rowData = [day+'-'+ dayOfWeek[day]];
    // Adicione os dados dos arrays restantes conforme necessário
    rowData.push(inicioManha[day] || '', aulasManha[day] || '', haeManha[day] || '', rubricaManha[day] || '');
    rowData.push(inicioTarde[day] || '', aulasTarde[day] || '', haeTarde[day] || '', rubricaTarde[day] || '');
    rowData.push(inicioNoite[day] || '', aulasNoite[day] || '', haeNoite[day] || '', rubricaNoite[day] || '');
    tableData.push(rowData);
}

// Estilos para o cabeçalho e corpo da tabela
const tableStyles = {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    lineWidth: 0.1,
    lineColor: [0, 0, 0],
    fontSize: 8, // Tamanho da fonte do corpo da tabela
    font: 'times',
    cellPadding: 1, // Altura das linhas do corpo da tabela
    halign: 'center', // Centralizando o texto horizontalmente
    valign: 'middle' // Centralizando o texto verticalmente
};
// Adicionando bordas à tabela
doc.autoTable({
    startY: startY, // Posição Y inicial
    margin: { top: 10, right: 10, bottom: 10, left: 10 }, // Margens reduzidas
    head: [
        [{ content: 'Dia', rowSpan: 2, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Manhã', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Tarde', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Noite', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Observações', rowSpan: 2, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } }],
        ['Inicio', 'Aulas', 'HAE/C', 'Rubrica', 'Inicio', 'Aulas', 'HAE/C', 'Rubrica', 'Inicio', 'Aulas', 'HAE/C', 'Rubrica']
    ],
    body: tableData,
    theme: 'grid',
    columnStyles: { 
        4: { fontStyle: 'normal', halign: 'center', valign: 'middle' },
        8: { fontStyle: 'normal', halign: 'center', valign: 'middle' },
        12: { fontStyle: 'normal', halign: 'center', valign: 'middle' }
    }, 
    headStyles: tableStyles,
    bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        fontSize: 8, // Tamanho da fonte do corpo da tabela
        font: 'times',
        cellPadding: 1, // Altura das linhas do corpo da tabela
        halign: 'left', // Centralizando o texto horizontalmente
        valign: 'middle' // Centralizando o texto verticalmente
    }
});
       doc.addPage(); // Adiciona uma nova página para o próximo professor
         console.log('passeiaddPage') 
                   // Obtendo o caminho da pasta de downloads do Windows
const downloadsFolder = path.join(os.homedir(), 'Downloads');

// Formatando o nome do arquivo
const nomeArquivo = `registro_de_ponto_${mesSelecionado.replace(/ /g, '_')}.pdf`;

// Salvando o PDF na pasta de downloads
const filePath = path.join(downloadsFolder, nomeArquivo);
doc.save(filePath)
        });
 
    });
    });
    });
});


//res.render('/');
res.redirect("/")
}

exports.renderGeraRegistro = (req, res, next) => {
    const id = req.params.id;
    const mesSelecionado = req.body.mes;
    const anoSelecionado = req.body.ano;
    let nomeDisciplina = new Array(10);
    let nomeCursosAtribuidos = new Array(10);
    let ha = null;
    let hae = null;
    let haec = null;
    let periodoDisciplina = new Array(10);
    let idCursoDisciplinas = new Array(10);
    let verificaNomeCursoRepetido = null;
    let abreviacaoNomeCurso = null;
    let dayOfWeek =new Array(31);
    let inicioManha =new Array(31).fill(null);
    let aulasManha =new Array(31);
    let haeManha =new Array(31).fill(null);
    let haecManha =new Array(31).fill(null);
    let rubricaManha =new Array(31);
    let inicioTarde =new Array(31).fill(null);
    let aulasTarde =new Array(31);
    let haeTarde =new Array(31).fill(null);
    let haecTarde =new Array(31).fill(null);
    let rubricaTarde =new Array(31);
    let inicioNoite =new Array(31).fill(null);
    let aulasNoite =new Array(31);
    let haeNoite =new Array(31).fill(null);
    let haecNoite =new Array(31).fill(null);
    let rubricaNoite =new Array(31);
    let diasMes = new Array(31).fill('');
    let qtdDiasMes = 0;
    let totalAulas = 0;
    let totalDeDisciplinas=1;
    let auxPosVazia = 0;
    const preposicoes = ['de', 'e', 'do', 'da', 'dos', 'das', 'com', 'para'];
    let palavrasSignificativas = null;
    let verificaPeriodoHae = null;
    let verificaPeriodoHaec = null;
    
  
//Data para prencher tabela 
   let mesAno = DataParaImpressao(mesSelecionado, anoSelecionado);
   let startDate = new Date(mesAno + "-01");
   let endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
   let data = null;
   let mes = mesAno.substring(5,8);
   let ano = mesAno.substring(0,4);
   let horarioFormatado = 0;

    Impressao.findOne({
        where: {
            id: id
        },
        include: [
            {model: Disciplina, as:'IdDisciplina1', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina2', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina3', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina4', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina5', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina6', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina7', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina8', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina9', attributes: ['nomeDisciplina']},
            {model: Disciplina, as:'IdDisciplina10', attributes: ['nomeDisciplina']}
            ,{
                model: Professor
            }
        ]
        }).then(impressao => {
            
            if(impressao.idDisciplina10!=null){
                Disciplina.findByPk(impressao.idDisciplina10).then(disciplina => {
                    nomeDisciplina[10] = disciplina.nomeDisciplina;
                    periodoDisciplina[10] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc10;
                    idCursoDisciplinas[10] = disciplina.cursoId;

                })
            }
            if(impressao.idDisciplina9!=null){
                Disciplina.findByPk(impressao.idDisciplina9).then(disciplina => {
                    nomeDisciplina[9]= disciplina.nomeDisciplina;
                    periodoDisciplina[9] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc9;
                    idCursoDisciplinas[9] = disciplina.cursoId;
                }) 
            }       
            if(impressao.idDisciplina8!=null){
                Disciplina.findByPk(impressao.idDisciplina8).then(disciplina => {
                    nomeDisciplina[8] = disciplina.nomeDisciplina;
                    periodoDisciplina[8] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc8;
                    idCursoDisciplinas[8] = disciplina.cursoId;
                    })
            }
            if(impressao.idDisciplina7!=null){
                Disciplina.findByPk(impressao.idDisciplina7).then(disciplina => {
                    nomeDisciplina[7] = disciplina.nomeDisciplina;
                    periodoDisciplina[7] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc7;
                    idCursoDisciplinas[7] = disciplina.cursoId;
                })
            }
            if(impressao.idDisciplina6!=null){
                Disciplina.findByPk(impressao.idDisciplina6).then(disciplina => {
                    nomeDisciplina[6]= disciplina.nomeDisciplina;
                    periodoDisciplina[6] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc6;
                    idCursoDisciplinas[6] = disciplina.cursoId;
                }) 
            }       
            if(impressao.idDisciplina5!=null){
                Disciplina.findByPk(impressao.idDisciplina5).then(disciplina => {
                    nomeDisciplina[5] = disciplina.nomeDisciplina;
                    periodoDisciplina[5] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc5;
                    idCursoDisciplinas[5] = disciplina.cursoId;
                    })
            }
            if(impressao.idDisciplina4!=null){
                Disciplina.findByPk(impressao.idDisciplina4).then(disciplina => {
                    nomeDisciplina[4] = disciplina.nomeDisciplina;
                    periodoDisciplina[4] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc4;
                    idCursoDisciplinas[4] = disciplina.cursoId;
                    })
            }
            if(impressao.idDisciplina3!=null){
                Disciplina.findByPk(impressao.idDisciplina3).then(disciplina => {
                    nomeDisciplina[3] = disciplina.nomeDisciplina;
                    periodoDisciplina[3] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc3;
                    idCursoDisciplinas[3] = disciplina.cursoId;;
                })
            }
            if(impressao.idDisciplina2!=null){
                Disciplina.findByPk(impressao.idDisciplina2).then(disciplina => {
                    nomeDisciplina[2]= disciplina.nomeDisciplina;
                    periodoDisciplina[2] = disciplina.periodo;
                    totalDeDisciplinas+=1;
                    ha += impressao.aulasDisc2;
                    idCursoDisciplinas[2] = disciplina.cursoId;
                }) 
            } 
            
                                 
            Disciplina.findByPk(impressao.idDisciplina1).then(disciplina => {
            nomeDisciplina[1] = disciplina.nomeDisciplina;
            periodoDisciplina[1] = disciplina.periodo;
            idCursoDisciplinas[1] = disciplina.cursoId;
            ha += impressao.aulasDisc1;
            ha += ha/2;
            totalAulas = (impressao.aulasDisc1+impressao.aulasDisc2+impressao.aulasDisc3+impressao.aulasDisc4+impressao.aulasDisc5+impressao.aulasDisc6+impressao.aulasDisc7+impressao.aulasDisc8+impressao.aulasDisc9+impressao.aulasDisc10)
            hae = impressao.hae1 + impressao.hae2 + impressao.hae3 + impressao.hae4;
            haec = impressao.haec1 + impressao.haec2 + impressao.haec3 + impressao.haec4;
            Curso.findAll({
                
            }).then(cursos =>{
                //Verifica os cursos que estão atribuidos ao professor, abrevia o nome e envia para a página de impressão
                cursos.forEach(curso => {
                    for(var i=1; i<= totalDeDisciplinas; i++){
                        if(curso.id == idCursoDisciplinas[i]){
                            if (i == 1){
                            palavrasSignificativas = curso.nomeCurso.split(' ');
                            palavrasSignificativas = palavrasSignificativas.filter(palavrasSignificativas => !preposicoes.includes(palavrasSignificativas.toLowerCase()));
                            abreviacaoNomeCurso = palavrasSignificativas.map(palavra => palavra.charAt(0)).join('');
                            abreviacaoNomeCurso = abreviacaoNomeCurso.toUpperCase();
                            nomeCursosAtribuidos[i] = abreviacaoNomeCurso;
                            auxPosVazia = i+1;
                            }
                            else{
                                palavrasSignificativas = curso.nomeCurso.split(' ');
                                palavrasSignificativas = palavrasSignificativas.filter(palavrasSignificativas => !preposicoes.includes(palavrasSignificativas.toLowerCase()));
                                abreviacaoNomeCurso = palavrasSignificativas.map(palavra => palavra.charAt(0)).join('');
                                abreviacaoNomeCurso = abreviacaoNomeCurso.toUpperCase();
                                verificaNomeCursoRepetido = abreviacaoNomeCurso;
                                if (verificaNomeCursoRepetido != nomeCursosAtribuidos[auxPosVazia -1]){
                                    nomeCursosAtribuidos[auxPosVazia ] = abreviacaoNomeCurso;
                                    auxPosVazia = i+1;
                                }
                                else{
                                    auxPosVazia = i
                                }
                            }
                        }
                    }
                })



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
    if (dayOfWeek[day] == impressao.diaSemanaDisc1 || dayOfWeek[day] == impressao.diaSemanaDisc2 || dayOfWeek[day] == impressao.diaSemanaDisc3 || dayOfWeek[day] == impressao.diaSemanaDisc4 || dayOfWeek[day] == impressao.diaSemanaDisc5 || dayOfWeek[day] == impressao.diaSemanaDisc6 || dayOfWeek[day] == impressao.diaSemanaDisc7 || dayOfWeek[day] == impressao.diaSemanaDisc8 || dayOfWeek[day] == impressao.diaSemanaDisc9 || dayOfWeek[day] == impressao.diaSemanaDisc10 || dayOfWeek[day] == impressao.diaSemanaHae1 || dayOfWeek[day] == impressao.diaSemanaHae2 || dayOfWeek[day] == impressao.diaSemanaHae3 || dayOfWeek[day] == impressao.diaSemanaHae4 || dayOfWeek[day] == impressao.diaSemanaHaec1 || dayOfWeek[day] == impressao.diaSemanaHaec2 || dayOfWeek[day] == impressao.diaSemanaHaec3 || dayOfWeek[day] == impressao.diaSemanaHaec4) {

        if(periodoDisciplina[1]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc1){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
                inicioManha[day] = horarioFormatado;
                aulasManha[day] = impressao.aulasDisc1;
                  
            }
                else if(periodoDisciplina[2]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc2){
                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc2.split(':'));
                    inicioManha[day] = horarioFormatado;
                    aulasManha[day] = impressao.aulasDisc2;
                    haeManha[day] = impressao.hae;  
                }
                    else if(periodoDisciplina[3]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc3){
                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc3.split(':'));
                        inicioManha[day] = horarioFormatado;
                        aulasManha[day] = impressao.aulasDisc3;
                        haeManha[day] = impressao.hae;  
                    }
                        else if(periodoDisciplina[4]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc4){
                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc4.split(':'));
                            inicioManha[day] = horarioFormatado;
                            aulasManha[day] = impressao.aulasDisc4;
                            haeManha[day] = impressao.hae;  
                        }
                            else if(periodoDisciplina[5]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc5){
                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc5.split(':'));
                                inicioManha[day] = horarioFormatado;
                                aulasManha[day] = impressao.aulasDisc5;
                                haeManha[day] = impressao.hae;  
                            }
                                else if(periodoDisciplina[6]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc6){
                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc6.split(':'));
                                    inicioManha[day] = horarioFormatado;
                                    aulasManha[day] = impressao.aulasDisc6;
                                    haeManha[day] = impressao.hae;  
                                }
                                    else if(periodoDisciplina[7]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc7){
                                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc7.split(':'));
                                        inicioManha[day] = horarioFormatado;
                                        aulasManha[day] = impressao.aulasDisc7;
                                        haeManha[day] = impressao.hae;  
                                    }
                                        else if(periodoDisciplina[8]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc8){
                                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc8.split(':'));
                                            inicioManha[day] = horarioFormatado;
                                            aulasManha[day] = impressao.aulasDisc8;
                                            haeManha[day] = impressao.hae;  
                                        }
                                            else if(periodoDisciplina[9]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc9){
                                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc9.split(':'));
                                                inicioManha[day] = horarioFormatado;
                                                aulasManha[day] = impressao.aulasDisc9;
                                                haeManha[day] = impressao.hae;  
                                            }
                                                else if(periodoDisciplina[10]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc10){
                                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc10.split(':'));
                                                    inicioManha[day] = horarioFormatado;
                                                    aulasManha[day] = impressao.aulasDisc10;
                                                    haeManha[day] = impressao.hae;  
                                                }
        if(periodoDisciplina[1]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc1){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
                inicioTarde[day] = horarioFormatado;
                aulasTarde[day] = impressao.aulasDisc1;
                haeTarde[day] = impressao.hae;  
            }
                else if(periodoDisciplina[2]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc2){
                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc2.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    aulasTarde[day] = impressao.aulasDisc2;
                    haeTarde[day] = impressao.hae;  
                }
                    else if(periodoDisciplina[3]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc3){
                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc3.split(':'));
                        inicioTarde[day] = horarioFormatado;
                        aulasTarde[day] = impressao.aulasDisc3;
                        haeTarde[day] = impressao.hae;  
                    }
                        else if(periodoDisciplina[4]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc4){
                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc4.split(':'));
                            inicioTarde[day] = horarioFormatado;
                            aulasTarde[day] = impressao.aulasDisc4;
                            haeTarde[day] = impressao.hae;  
                        }
                            else if(periodoDisciplina[5]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc5){
                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc5.split(':'));
                                inicioTarde[day] = horarioFormatado;
                                aulasTarde[day] = impressao.aulasDisc5;
                                haeTarde[day] = impressao.hae;  
                            }
                                else if(periodoDisciplina[6]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc6){
                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc6.split(':'));
                                    inicioTarde[day] = horarioFormatado;
                                    aulasTarde[day] = impressao.aulasDisc6;
                                    haeTarde[day] = impressao.hae;  
                                }
                                    else if(periodoDisciplina[7]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc7){
                                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc7.split(':'));
                                        inicioTarde[day] = horarioFormatado;
                                        aulasTarde[day] = impressao.aulasDisc7;
                                        haeTarde[day] = impressao.hae;  
                                    }
                                        else if(periodoDisciplina[8]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc8){
                                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc8.split(':'));
                                            inicioTarde[day] = horarioFormatado;
                                            aulasTarde[day] = impressao.aulasDisc8;
                                            haeTarde[day] = impressao.hae;  
                                        }
                                            else if(periodoDisciplina[9]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc9){
                                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc9.split(':'));
                                                inicioTarde[day] = horarioFormatado;
                                                aulasTarde[day] = impressao.aulasDisc9;
                                                haeTarde[day] = impressao.hae;  
                                            }
                                                else if(periodoDisciplina[10]== "Tarde" && dayOfWeek[day] == impressao.diaSemanaDisc10){
                                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc10.split(':'));
                                                    inicioTarde[day] = horarioFormatado;
                                                    aulasTarde[day] = impressao.aulasDisc10;
                                                    haeTarde[day] = impressao.hae;  
                                                }
        if(periodoDisciplina[1]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc1){
            horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
            inicioNoite[day] = horarioFormatado;
            aulasNoite[day] = impressao.aulasDisc1;
            haeNoite[day] = impressao.hae;  
        }
            else if(periodoDisciplina[2]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc2){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc2.split(':'));
                inicioNoite[day] = horarioFormatado;
                aulasNoite[day] = impressao.aulasDisc2;
                haeNoite[day] = impressao.hae;  
            }
                else if(periodoDisciplina[3]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc3){
                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc3.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    aulasNoite[day] = impressao.aulasDisc3;
                    haeNoite[day] = impressao.hae;  
                }
                    else if(periodoDisciplina[4]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc4){
                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc4.split(':'));
                        inicioNoite[day] = horarioFormatado;
                        aulasNoite[day] = impressao.aulasDisc4;
                        haeNoite[day] = impressao.hae;  
                    }
                        else if(periodoDisciplina[5]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc5){
                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc5.split(':'));
                            inicioNoite[day] = horarioFormatado;
                            aulasNoite[day] = impressao.aulasDisc5;
                            haeNoite[day] = impressao.hae;  
                        }
                            else if(periodoDisciplina[6]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc6){
                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc6.split(':'));
                                inicioNoite[day] = horarioFormatado;
                                aulasNoite[day] = impressao.aulasDisc6;
                                haeNoite[day] = impressao.hae;  
                            }
                                else if(periodoDisciplina[7]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc7){
                                    horarioFormatado = HoraParaImpressao(impressao.horarioDisc7.split(':'));
                                    inicioNoite[day] = horarioFormatado;
                                    aulasNoite[day] = impressao.aulasDisc7;
                                    haeNoite[day] = impressao.hae;  
                                }
                                    else if(periodoDisciplina[8]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc8){
                                        horarioFormatado = HoraParaImpressao(impressao.horarioDisc8.split(':'));
                                        inicioNoite[day] = horarioFormatado;
                                        aulasNoite[day] = impressao.aulasDisc8;
                                        haeNoite[day] = impressao.hae;  
                                    }
                                        else if(periodoDisciplina[9]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc9){
                                            horarioFormatado = HoraParaImpressao(impressao.horarioDisc9.split(':'));
                                            inicioNoite[day] = horarioFormatado;
                                            aulasNoite[day] = impressao.aulasDisc9;
                                            haeNoite[day] = impressao.hae;  
                                        }
                                            else if(periodoDisciplina[10]== "Noite" && dayOfWeek[day] == impressao.diaSemanaDisc10){
                                                horarioFormatado = HoraParaImpressao(impressao.horarioDisc10.split(':'));
                                                inicioNoite[day] = horarioFormatado;
                                                aulasNoite[day] = impressao.aulasDisc10;
                                                haeNoite[day] = impressao.hae;  
                                            }
            if (dayOfWeek[day] == 'dom.'){
                rubricaManha[day] = "DOMINGO";
                rubricaTarde[day] = "DOMINGO";
                rubricaNoite[day] = "DOMINGO"; 
            }
            
            //Preencher hae e haec

          else  if(dayOfWeek[day] == impressao.diaSemanaHae1){
                verificaPeriodoHae = impressao.horarioHae1.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae1.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae1;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae1.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae1;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae1.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae1;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHae2){
                verificaPeriodoHae = impressao.horarioHae2.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae2.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae2;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae2.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae2;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae2.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae2;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHae3){
                verificaPeriodoHae = impressao.horarioHae3.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae3.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae3;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae3.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae3;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae3.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae3;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHae4){
                verificaPeriodoHae = impressao.horarioHae4.split(':');
                verificaPeriodoHae = verificaPeriodoHae[0];
                if(verificaPeriodoHae < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae4.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haeManha[day] = impressao.hae4;
                }
                else if(verificaPeriodoHae>=12 && verificaPeriodoHae<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae4.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haeTarde[day] = impressao.hae4;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHae4.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haeNoite[day] = impressao.hae4;
                }
            }
            if(dayOfWeek[day] == impressao.diaSemanaHaec1){
                verificaPeriodoHaec = impressao.horarioHaec1.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec1.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec1;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec1.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec1;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec1.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec1;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHaec2){
                verificaPeriodoHaec = impressao.horarioHaec2.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec2.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec2;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec2.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec2;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec2.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec2;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHaec3){
                verificaPeriodoHaec = impressao.horarioHaec3.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec3.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec3;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec3.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec3;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec3.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec3;
                }
            }
            else if(dayOfWeek[day] == impressao.diaSemanaHaec4){
                verificaPeriodoHaec = impressao.horarioHaec4.split(':');
                verificaPeriodoHaec = verificaPeriodoHaec[0];
                if(verificaPeriodoHaec < 12){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec4.split(':'));
                    inicioManha[day] = horarioFormatado;
                    haecManha[day] = impressao.haec4;
                }
                else if(verificaPeriodoHaec>=12 && verificaPeriodoHaec<18){
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec4.split(':'));
                    inicioTarde[day] = horarioFormatado;
                    haecTarde[day] = impressao.haec4;
                }
                else{
                    horarioFormatado = HoraParaImpressao(impressao.horarioHaec4.split(':'));
                    inicioNoite[day] = horarioFormatado;
                    haecNoite[day] = impressao.haec4;
                }
            }
            
                if(inicioManha[day] == null && haeManha[day] == null && haecManha[day] == null ){
                    rubricaManha[day] = " - ";
                }
                else{
                    rubricaManha[day] = " ";
                } 
                if(inicioTarde[day] == null && haeTarde[day] == null && haecTarde[day] == null){
                    rubricaTarde[day] = " - ";
                }
                else{
                    rubricaTarde[day] = " ";
                }
                if(inicioNoite[day] == null && haeNoite[day] == null && haecNoite[day] == null){
                    rubricaNoite[day] = " - ";
                }
                else{
                    rubricaNoite[day] = " ";
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
    
    //Preencher feriado
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


// Criando um novo documento jsPDF
const doc = new jsPDF({
    orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
});

// Adicionando cabeçalho
    doc.setFont('times', 'bold'); // Define a fonte e estilo (negrito)
      doc.setFontSize(10); // Define o tamanho da fonte
  doc.text(`FATEC MOGI MIRIM  -  REGISTRO DE PRESENÇA DE DOCENTE - ${mesSelecionado}/ ${ano}`, 80, 5);
  doc.setFont('times', 'normal'); // Define a fonte e estilo (negrito)
  doc.setFontSize(9); // Define o tamanho da fonte
  // Desenha uma linha separadora
  doc.setLineWidth(0.25); // Define a largura da linha
  doc.line(10, 7, 290, 7); // Desenha a linha de (10, 25) a (pageWidth - 210, 25)

  // Adicionando informações do professor com formatação
doc.setFont('times', 'bold');
doc.text('Professor - Reg.: ', 10, 12);
doc.setFont('times', 'normal');
doc.text(' ' + impressao.professor.numeroRegistro, doc.getTextWidth('Professor - Reg.: ') + 10, 12);

const posAfterNumeroRegistro = doc.getTextWidth(`Professor - Reg.: ${impressao.professor.numeroRegistro}`) + 20;
doc.setFont('times', 'bold');
doc.text(' Nome: ', posAfterNumeroRegistro, 12);
doc.setFont('times', 'normal');
doc.text(impressao.professor.nome, posAfterNumeroRegistro + doc.getTextWidth(' Nome: '), 12);

const posAfterNome = posAfterNumeroRegistro + doc.getTextWidth(` Nome: ${impressao.professor.nome}`)+50;
doc.setFont('times', 'bold');
doc.text(' Categoria: ', posAfterNome, 12);
doc.setFont('times', 'normal');
doc.text(' ' + impressao.professor.categoria, posAfterNome + doc.getTextWidth(' Categoria: '), 12);

const posAfterCategoria = posAfterNome + doc.getTextWidth(` Categoria: ${impressao.professor.categoria}`)+50;
doc.setFont('times', 'bold');
doc.text(' Curso:', posAfterCategoria, 12);
doc.setFont('times', 'normal');
doc.text('', posAfterCategoria + doc.getTextWidth(' Curso: '), 12);

const posAfterCurso = posAfterCategoria + doc.getTextWidth('Curso: ') ;
let offsetpos = 0;
nomeCursosAtribuidos.forEach(curso => {
doc.text(' ' + curso + '/', posAfterCurso + offsetpos, 12);
offsetpos += 8
});

doc.setFont('times', 'bold');
doc.text(`Disciplinas: `, 10, 17);
let offsetposDisciplina = 26;
doc.setFont('times', 'normal');
nomeDisciplina.forEach(disciplina => {
doc.text(' ' + disciplina + '/', offsetposDisciplina, 17);
offsetposDisciplina += doc.getTextWidth(`${disciplina}`) + 3;
});


 
doc.setFont('times', 'bold');
doc.text('Aulas: ', 10, 22);
doc.setFont('times', 'normal');
doc.text(`${totalAulas}`, doc.getTextWidth('Aulas: ') + 10, 22);

const posAfterAulas = doc.getTextWidth(`Aulas: ${totalAulas}`) + 40;
doc.setFont('times', 'bold');
doc.text(' H.A: ', posAfterAulas, 22);
doc.setFont('times', 'normal');
doc.text(`${ha}`, posAfterAulas + doc.getTextWidth(' H.A: '), 22);

const posAfterHA = posAfterAulas + doc.getTextWidth(` H.A: ${ha}`)+40;
doc.setFont('times', 'bold');
doc.text(' H.A.E: ', posAfterHA, 22);
doc.setFont('times', 'normal');
doc.text(`${hae}`, posAfterHA + doc.getTextWidth(' H.A.E: '), 22);

const posAfterHAE = posAfterHA + doc.getTextWidth(` H.A.E: ${hae}`)+40;
doc.setFont('times', 'bold');
doc.text(' H.A.E.C:', posAfterHAE, 22);
doc.setFont('times', 'normal');
doc.text(`${haec}`, posAfterHAE + doc.getTextWidth(' H.A.E.C: '), 22);
  
const posAfterHAEC = posAfterHAE + doc.getTextWidth(` Jornada:`)+40;
doc.setFont('times', 'bold');
doc.text(' Jornada:', posAfterHAEC, 22);


// Definindo a posição inicial da tabela
const startY = 24; // Posição Y inicial abaixo do cabeçalho

// Adicionando dados à tabela
const tableData = []
for (let day = 1; day <= qtdDiasMes; day++) {
    const rowData = [day+'-'+ dayOfWeek[day]];
    // Adicione os dados dos arrays restantes conforme necessário
    rowData.push(inicioManha[day] || '', aulasManha[day] || '', haeManha[day] || '', rubricaManha[day] || '');
    rowData.push(inicioTarde[day] || '', aulasTarde[day] || '', haeTarde[day] || '', rubricaTarde[day] || '');
    rowData.push(inicioNoite[day] || '', aulasNoite[day] || '', haeNoite[day] || '', rubricaNoite[day] || '');
    tableData.push(rowData);
}

// Estilos para o cabeçalho e corpo da tabela
const tableStyles = {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    lineWidth: 0.1,
    lineColor: [0, 0, 0],
    fontSize: 8, // Tamanho da fonte do corpo da tabela
    font: 'times',
    cellPadding: 1, // Altura das linhas do corpo da tabela
    halign: 'center', // Centralizando o texto horizontalmente
    valign: 'middle' // Centralizando o texto verticalmente
};
// Adicionando bordas à tabela
doc.autoTable({
    startY: startY, // Posição Y inicial
    margin: { top: 10, right: 10, bottom: 10, left: 10 }, // Margens reduzidas
    head: [
        [{ content: 'Dia', rowSpan: 2, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Manhã', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Tarde', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Noite', colSpan: 4, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } },
        { content: 'Observações', rowSpan: 2, styles: { fontStyle: 'bold', halign: 'center', valign: 'middle' } }],
        ['Inicio', 'Aulas', 'HAE/C', 'Rubrica', 'Inicio', 'Aulas', 'HAE/C', 'Rubrica', 'Inicio', 'Aulas', 'HAE/C', 'Rubrica']
    ],
    body: tableData,
    theme: 'grid',
    columnStyles: { 
        4: { fontStyle: 'normal', halign: 'center', valign: 'middle' },
        8: { fontStyle: 'normal', halign: 'center', valign: 'middle' },
        12: { fontStyle: 'normal', halign: 'center', valign: 'middle' }
    }, 
    headStyles: tableStyles,
    bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        fontSize: 8, // Tamanho da fonte do corpo da tabela
        font: 'times',
        cellPadding: 1, // Altura das linhas do corpo da tabela
        halign: 'left', // Centralizando o texto horizontalmente
        valign: 'middle' // Centralizando o texto verticalmente
    }
});

// Obtendo o caminho da pasta de downloads do Windows
const downloadsFolder = path.join(os.homedir(), 'Downloads');

// Formatando o nome do arquivo
const nomeArquivo = `registro_de_ponto_${mesSelecionado}_${impressao.professor.nome.replace(/ /g, '_')}.pdf`;

// Salvando o PDF na pasta de downloads
const filePath = path.join(downloadsFolder, nomeArquivo);
doc.save(filePath);

            res.render('impressao/pagina', {impressao: impressao, nomeDisciplina, totalAulas, nomeCursosAtribuidos, ha, hae, haec, mesSelecionado, dayOfWeek, inicioManha, aulasManha, haeManha, haecManha, rubricaManha, inicioTarde, aulasTarde, haeTarde, haecTarde, rubricaTarde, inicioNoite, aulasNoite, haeNoite, haecNoite, rubricaNoite, diasMes, qtdDiasMes, ano});
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
    let hae1 = req.body.hae1;
    let hae2 = req.body.hae2;
    let hae3 = req.body.hae3;
    let hae4 = req.body.hae4;
    let horarioHae1 = req.body.horarioHae1;
    let horarioHae2 = req.body.horarioHae2;
    let horarioHae3 = req.body.horarioHae3;
    let horarioHae4 = req.body.horarioHae4;
    let diaSemanaHae1 = req.body.diaSemanaHae1;
    let diaSemanaHae2 = req.body.diaSemanaHae2;
    let diaSemanaHae3 = req.body.diaSemanaHae3;
    let diaSemanaHae4 = req.body.diaSemanaHae4;
    let haec1 = req.body.haec1;
    let haec2 = req.body.haec2;
    let haec3 = req.body.haec3;
    let haec4 = req.body.haec4;
    let horarioHaec1 = req.body.horarioHaec1;
    let horarioHaec2 = req.body.horarioHaec2;
    let horarioHaec3 = req.body.horarioHaec3;
    let horarioHaec4 = req.body.horarioHaec4;
    let diaSemanaHaec1 = req.body.diaSemanaHaec1;
    let diaSemanaHaec2 = req.body.diaSemanaHaec2;
    let diaSemanaHaec3 = req.body.diaSemanaHaec3;
    let diaSemanaHaec4 = req.body.diaSemanaHaec4;
    const anoImpressao = new Date();
    let msgOK = '1';
    let msgNOK = '0';
    let msgHorarioInvalido = '1';
    let horarioOk = false;
    let verificaHorarioDisciplina = 0; //Verifica se o horário da disciplina está dentro do período correto 
    
    if(hae1 == ''){
        hae1 = null;
        horarioHae1 = null;
        diaSemanaHae1 = null;
    }
    if(hae2 == ''){
        hae2 = null;
        horarioHae2 = null;
        diaSemanaHae2 = null;
    }
    if(hae3 == ''){
        hae3 = null;
        horarioHae3 = null;
        diaSemanaHae3 = null;
    }
    if(hae4 == ''){
        hae4 = null;
        horarioHae4 = null;
        diaSemanaHae4 = null;
    }
    if(haec1 == ''){
        haec1 = null;
        horarioHaec1 = null;
        diaSemanaHaec1 = null;
    }
    if(haec2 == ''){
        haec2 = null;
        horarioHaec2 = null;
        diaSemanaHaec2 = null;
    }
    if(haec3 == ''){
        haec3 = null;
        horarioHaec3 = null;
        diaSemanaHaec3 = null;
    }
    if(haec4 == ''){
        haec4 = null;
        horarioHaec4 = null;
        diaSemanaHaec4 = null;
    }


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
                hae1: hae1,
                hae2: hae2,
                hae3: hae3,
                hae4: hae4,
                horarioHae1: horarioHae1,
                horarioHae2: horarioHae2,
                horarioHae3: horarioHae3,
                horarioHae4: horarioHae4,
                diaSemanaHae1: diaSemanaHae1,
                diaSemanaHae2: diaSemanaHae2,
                diaSemanaHae3: diaSemanaHae3,
                diaSemanaHae4: diaSemanaHae4,
                haec1: haec1,
                haec2: haec2,
                haec3: haec3,
                haec4: haec4,
                horarioHaec1: horarioHaec1,
                horarioHaec2: horarioHaec2,
                horarioHaec3: horarioHaec3,
                horarioHaec4: horarioHaec4,
                diaSemanaHaec1: diaSemanaHaec1,
                diaSemanaHaec2: diaSemanaHaec2,
                diaSemanaHaec3: diaSemanaHaec3,
                diaSemanaHaec4: diaSemanaHaec4,
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
    const formulario = 0;

    Impressao.findOne({
            where: {
                id: id
            },
            include: [
                {model: Disciplina, as:'IdDisciplina1', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina2', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina3', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina4', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina5', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina6', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina7', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina8', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina9', attributes: ['nomeDisciplina']},
                {model: Disciplina, as:'IdDisciplina10', attributes: ['nomeDisciplina']}
    
            ,
                {
                model: Professor
                },
            ]
        }).then(impressao => {
            let qtdDisciplinas = 0;
            //Verifica quantas disciplinas foram adicionadas para poder editar
            if(impressao?.idDisciplina1 != null){
                qtdDisciplinas++;
            }
                if(impressao?.idDisciplina2 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina3 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina4 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina5 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina6 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina7 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina8 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina9 != null){
                    qtdDisciplinas++;
                }
                if(impressao?.idDisciplina10 != null){
                    qtdDisciplinas++;
                }
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
                    res.render('impressao/editar', {impressao: impressao, disciplinas: disciplinas, qtdDisciplinas, formulario});
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
    let hae1 = req.body.hae1;
    let hae2 = req.body.hae2;
    let hae3 = req.body.hae3;
    let hae4 = req.body.hae4;
    let horarioHae1 = req.body.horarioHae1;
    let horarioHae2 = req.body.horarioHae2;
    let horarioHae3 = req.body.horarioHae3;
    let horarioHae4 = req.body.horarioHae4;
    let diaSemanaHae1 = req.body.diaSemanaHae1;
    let diaSemanaHae2 = req.body.diaSemanaHae2;
    let diaSemanaHae3 = req.body.diaSemanaHae3;
    let diaSemanaHae4 = req.body.diaSemanaHae4;
    let haec1 = req.body.haec1;
    let haec2 = req.body.haec2;
    let haec3 = req.body.haec3;
    let haec4 = req.body.haec4;
    let horarioHaec1 = req.body.horarioHaec1;
    let horarioHaec2 = req.body.horarioHaec2;
    let horarioHaec3 = req.body.horarioHaec3;
    let horarioHaec4 = req.body.horarioHaec4;
    let diaSemanaHaec1 = req.body.diaSemanaHaec1;
    let diaSemanaHaec2 = req.body.diaSemanaHaec2;
    let diaSemanaHaec3 = req.body.diaSemanaHaec3;
    let diaSemanaHaec4 = req.body.diaSemanaHaec4;
    const anoImpressao = new Date();
    let msgOK = '1';
    let msgNOK = '0';

    if(hae1 == ''){
        hae1 = null;
        horarioHae1 = null;
        diaSemanaHae1 = null;
    }
    if(hae2 == ''){
        hae2 = null;
        horarioHae2 = null;
        diaSemanaHae2 = null;
    }
    if(hae3 == ''){
        hae3 = null;
        horarioHae3 = null;
        diaSemanaHae3 = null;
    }
    if(hae4 == ''){
        hae4 = null;
        horarioHae4 = null;
        diaSemanaHae4 = null;
    }
    if(haec1 == ''){
        haec1 = null;
        horarioHaec1 = null;
        diaSemanaHaec1 = null;
    }
    if(haec2 == ''){
        haec2 = null;
        horarioHaec2 = null;
        diaSemanaHaec2 = null;
    }
    if(haec3 == ''){
        haec3 = null;
        horarioHaec3 = null;
        diaSemanaHaec3 = null;
    }
    if(haec4 == ''){
        haec4 = null;
        horarioHaec4 = null;
        diaSemanaHaec4 = null;
    }

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
        hae1: hae1,
        hae2: hae2,
        hae3: hae3,
        hae4: hae4,
        horarioHae1: horarioHae1,
        horarioHae2: horarioHae2,
        horarioHae3: horarioHae3,
        horarioHae4: horarioHae4,
        diaSemanaHae1: diaSemanaHae1,
        diaSemanaHae2: diaSemanaHae2,
        diaSemanaHae3: diaSemanaHae3,
        diaSemanaHae4: diaSemanaHae4,
        haec1: haec1,
        haec2: haec2,
        haec3: haec3,
        haec4: haec4,
        horarioHaec1: horarioHaec1,
        horarioHaec2: horarioHaec2,
        horarioHaec3: horarioHaec3,
        horarioHaec4: horarioHaec4,
        diaSecmanaHaec1: diaSemanaHaec1,
        diaSecmanaHaec2: diaSemanaHaec2,
        diaSecmanaHaec3: diaSemanaHaec3,
        diaSecmanaHaec4: diaSemanaHaec4,
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

