const router = require('express').Router();
const DadosPadraoController = require('../../../controllers/DadosPadraoController');
const dadosPadraoController = new DadosPadraoController();

router.get('/', dadosPadraoController.gerarDadosPadrao);

module.exports = router;