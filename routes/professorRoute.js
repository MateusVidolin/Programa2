const express = require('express');
const router = express.Router();

const ProfessorController = require('../controllers/ProfessorController');
const checkLogin = require('../middleware/checkLogin');
 
router.get('/', checkLogin, ProfessorController.getAll);
router.get('/novo', checkLogin, ProfessorController.renderNovo);
router.post('/', checkLogin, ProfessorController.create);
//router.get('/busca', checkLogin, ProfessorController.renderBusca);
//router.post('/buscar', checkLogin, ProfessorController.resultadoBusca);
router.get('/:id', checkLogin, ProfessorController.renderEditar);
router.post('/salvar', checkLogin, ProfessorController.update);
router.get('/delete/:id', checkLogin, ProfessorController.delete);


module.exports = router;