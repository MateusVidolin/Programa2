const express = require('express');
const router = express.Router();

const CursoController = require('../controllers/CursoController');
const checkLogin = require('../middleware/checkLogin');
 
router.get('/', checkLogin, CursoController.getAll);
router.get('/novo', checkLogin, CursoController.renderNovo);
router.post('/', checkLogin, CursoController.create);
router.get('/:id', checkLogin, CursoController.renderEditar);
router.post('/salvar', checkLogin, CursoController.update);
router.get('/delete/:id', checkLogin, CursoController.delete);


module.exports = router;