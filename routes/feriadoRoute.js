const express = require('express');
const router = express.Router();

const FeriadoController = require('../controllers/FeriadoController');
const checkLogin = require('../middleware/checkLogin');
 
router.get('/', checkLogin, FeriadoController.getAll);
router.get('/novo', checkLogin, FeriadoController.renderNovo);
router.post('/', checkLogin, FeriadoController.create);
router.get('/:id', checkLogin, FeriadoController.renderEditar);
router.post('/salvar', checkLogin, FeriadoController.update);
router.get('/delete/:id', checkLogin, FeriadoController.delete);


module.exports = router;