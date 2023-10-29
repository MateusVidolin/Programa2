const express = require('express');
const router = express.Router();

const DisciplinaController = require('../controllers/DisciplinaController');
const checkLogin = require('../middleware/checkLogin');
 
router.get('/', checkLogin, DisciplinaController.getAll);
router.get('/novo', checkLogin, DisciplinaController.renderNovo);
router.post('/', checkLogin, DisciplinaController.create);
router.get('/:id', checkLogin, DisciplinaController.renderEditar);
router.post('/salvar', checkLogin, DisciplinaController.update);
router.get('/delete/:id', checkLogin, DisciplinaController.delete);


module.exports = router;