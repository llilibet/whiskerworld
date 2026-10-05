const express = require('express');
const {
  autenticarToken,
} = require('../middlewares/authMiddleware');
const {
  registrarAcompanhamento,
  listarAcompanhamentos,
} = require('../controllers/acompanhamentosController');
const uploadFotoAcompanhamento = require(
  '../middlewares/uploadFotoAcompanhamento'
);

const router = express.Router();

router.get(
  '/:adocaoId',
  autenticarToken,
  listarAcompanhamentos
);

router.post(
  '/:adocaoId',
  autenticarToken,
  uploadFotoAcompanhamento,
  registrarAcompanhamento
);

module.exports = router;