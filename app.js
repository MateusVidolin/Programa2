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
//const Autor = require('./models/autor');
//const Livro = require('./models/livro');

// Importar Rotas
const usuarioRoute = require('./routes/usuarioRoute')
const professorRoute = require('./routes/professorRoute')
const cursoRoute = require('./routes/cursoRoute')

// Rotas
app.get('/', checkLogin, (req, res, next) => {
  res.render('index');
});

app.use('/usuarios', usuarioRoute);
app.use('/professors', professorRoute);
app.use('/cursos', cursoRoute);

module.exports = app;
