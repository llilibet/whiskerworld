const express = require("express");
const router = express.Router();
const agendamentosController = require("../controllers/agendamentosController");
const {
  autenticarToken,
  apenasAdmin,
} = require("../middlewares/authMiddleware");

// Criar agendamento (usuário logado – adotante ou admin)
router.post(
  "/",
  autenticarToken,
  agendamentosController.criarAgendamento
);

// Listar meus agendamentos (usuário logado)
router.get(
  "/me",
  autenticarToken,
  agendamentosController.listarMeusAgendamentos
);

// Listar todos agendamentos (apenas ADMIN)
router.get(
  "/",
  autenticarToken,
  apenasAdmin,
  agendamentosController.listarTodosAgendamentos
);


// Atualizar status (apenas ADMIN)
router.put(
  "/:id/status",
  autenticarToken,
  apenasAdmin,
  agendamentosController.atualizarStatusAgendamento
);

// Deletar / cancelar agendamento (dono ou ADMIN)
router.delete(
  "/:id",
  autenticarToken,
  agendamentosController.deletarAgendamento
);

// iniciar fluxo para agendamento (público)
router.get(
  "/iniciar/:animalId",
  agendamentosController.iniciarFluxoAgendamento
);

module.exports = router;
