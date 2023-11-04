const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const connection = require('./database/database');
const checkLogin = require('./middleware/checkLogin');

// Setup do ambiente
// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Sessions
app.use(session({
  secret: 'livro',
  cookie: {
    maxAge: 1200000,
  },
  resave: false,
  saveUninitialized: false
}));

// Ativar os arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Banco de Dados
connection.authenticate()
          .then(() => {
            console.log('Conexão feita com sucesso!');
          })
          .catch(erro => {
            console.log('Problemas na conexão!');
          })

// Parser de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Models
const Usuario = require('./models/usuario');
const Professor = require('./models/professor');
const Curso = require('./models/curso');
const Disciplina = require('./models/disciplina');
const Feriado = require('./models/feriado');
const Impressao = require('./models/impressao');

// Importar Rotas
const usuarioRoute = require('./routes/usuarioRoute')
const professorRoute = require('./routes/professorRoute')
const cursoRoute = require('./routes/cursoRoute')
const disciplinaRoute = require('./routes/disciplinaRoute')
const feriadoRoute = require('./routes/feriadoRoute')
const impressaoRoute = require('./routes/impressaoRoute')

// Rotas
app.get('/', checkLogin, (req, res, next) => {
  res.render('index');
});

app.use('/usuarios', usuarioRoute);
app.use('/professors', professorRoute);
app.use('/cursos', cursoRoute);
app.use('/disciplinas', disciplinaRoute);
app.use('/disciplinas', disciplinaRoute);
app.use('/feriados', feriadoRoute);
app.use('/impressaos', impressaoRoute);

module.exports = app;
