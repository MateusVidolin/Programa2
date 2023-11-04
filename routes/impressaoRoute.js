const express = require('express');
const router = express.Router();

const ImpressaoController = require('../controllers/ImpressaoController');
const checkLogin = require('../middleware/checkLogin');
 
router.get('/', checkLogin, ImpressaoController.getAll);
router.get('/novo', checkLogin, ImpressaoController.renderNovo);
router.post('/', checkLogin, ImpressaoController.create);
router.get('/adicionaDisc/:id', checkLogin, ImpressaoController.renderAdicionaDisc);
router.post('/salvarDisc', checkLogin, ImpressaoController.adicionarDisc);
router.get('/:id', checkLogin, ImpressaoController.renderEditar);
router.post('/salvar', checkLogin, ImpressaoController.update);
router.get('/delete/:id', checkLogin, ImpressaoController.delete);



module.exports = router;