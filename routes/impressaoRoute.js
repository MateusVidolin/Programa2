const express = require('express');
const router = express.Router();

const ImpressaoController = require('../controllers/ImpressaoController');
const checkLogin = require('../middleware/checkLogin');
 
router.get('/', checkLogin, ImpressaoController.getAll);
router.get('/novo', checkLogin, ImpressaoController.renderNovo);
router.post('/', checkLogin, ImpressaoController.create);
router.get('/:id', checkLogin, ImpressaoController.renderEditar);
router.post('/salvar', checkLogin, ImpressaoController.update);
router.get('/delete/:id', checkLogin, ImpressaoController.delete);
router.get('/selecionaMes/:id', checkLogin, ImpressaoController.renderSelecionaMes);
router.post('/selecioneMes/:id', checkLogin, ImpressaoController.renderGeraRegistro);





module.exports = router;