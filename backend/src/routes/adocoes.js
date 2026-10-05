const express = require('express');
const {
  concluirAdocao,
  listarMinhasAdocoes,
} = require('../controllers/adocoesController');
const {
  autenticarToken,
  apenasAdmin,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/me',
  autenticarToken,
  listarMinhasAdocoes
);

router.post(
  '/agendamento/:agendamentoId',
  autenticarToken,
  apenasAdmin,
  concluirAdocao
);

module.exports = router;