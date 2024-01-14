const { DATEONLY } = require('sequelize');
const Curso = require('../models/curso');
const Disciplina = require('../models/disciplina');
const Feriado = require('../models/feriado');
const Impressao = require('../models/impressao');
const Professor = require('../models/professor');
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



exports.renderGeraRegistro = (req, res, next) => {
    const id = req.params.id;
    const mesSelecionado = req.body.mes;
    const anoSelecionado = req.body.ano;
    let nomeDisciplina = new Array(10);
    let nomeCursosAtribuidos = new Array(10);
    let ha = null;
    let periodoDisciplina = new Array(10);
    let idCursoDisciplinas = new Array(10);
    let verificaNomeCursoRepetido = null;
    let abreviacaoNomeCurso = null;
    let dayOfWeek =new Array(31);
    let inicioManha =new Array(31).fill(null);
    let aulasManha =new Array(31);
    let haeManha =new Array(31);
    let rubricaManha =new Array(31);
    let inicioTarde =new Array(31).fill(null);
    let aulasTarde =new Array(31);
    let haeTarde =new Array(31);
    let rubricaTarde =new Array(31);
    let inicioNoite =new Array(31).fill(null);
    let aulasNoite =new Array(31);
    let haeNoite =new Array(31);
    let rubricaNoite =new Array(31);
    let diasMes = new Array(31).fill('');
    let qtdDiasMes = 0;
    let totalAulas = 0;
    let totalDeDisciplinas=1;
    let auxPosVazia = 0;
    const preposicoes = ['de', 'e', 'do', 'da', 'dos', 'das', 'com', 'para'];
    let palavrasSignificativas = null;
    
  
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
    if (dayOfWeek[day] == impressao.diaSemanaDisc1 || dayOfWeek[day] == impressao.diaSemanaDisc2 || dayOfWeek[day] == impressao.diaSemanaDisc3 || dayOfWeek[day] == impressao.diaSemanaDisc4 || dayOfWeek[day] == impressao.diaSemanaDisc5 || dayOfWeek[day] == impressao.diaSemanaDisc6 || dayOfWeek[day] == impressao.diaSemanaDisc7 || dayOfWeek[day] == impressao.diaSemanaDisc8 || dayOfWeek[day] == impressao.diaSemanaDisc9 || dayOfWeek[day] == impressao.diaSemanaDisc10) {

        if(periodoDisciplina[1]== "Manhã" && dayOfWeek[day] == impressao.diaSemanaDisc1){
                horarioFormatado = HoraParaImpressao(impressao.horarioDisc1.split(':'));
                inicioManha[day] = horarioFormatado;
                aulasManha[day] = impressao.aulasDisc1;
                haeManha[day] = impressao.hae;  
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
            else{
                if(inicioManha[day] == null){
                    rubricaManha[day] = " - ";
                }
                else{
                    rubricaManha[day] = " ";
                } 
                if(inicioTarde[day] == null){
                    rubricaTarde[day] = " - ";
                }
                else{
                    rubricaTarde[day] = " ";
                }
                if(inicioNoite[day] == null){
                    rubricaNoite[day] = " - ";
                }
                else{
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
            res.render('impressao/pagina', {impressao: impressao, nomeDisciplina, totalAulas, nomeCursosAtribuidos, ha, mesSelecionado, dayOfWeek, inicioManha, aulasManha, haeManha, rubricaManha, inicioTarde, aulasTarde, haeTarde, rubricaTarde, inicioNoite, aulasNoite, haeNoite, rubricaNoite, diasMes, qtdDiasMes, ano});
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
            if(impressao.idDisciplina1 != null){
                qtdDisciplinas++;
            }
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