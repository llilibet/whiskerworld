const express = require("express");
const router = express.Router();
const animaisController = require("../controllers/animaisController");
const { autenticarToken, apenasAdmin } = require("../middlewares/authMiddleware");
const uploadFotoAnimal = require("../middlewares/uploadFotoAnimal");

// Lista animais (público) – GET /animais?tipo=GATO ou CAO
router.get("/", animaisController.listarAnimais);

// Detalhes de um animal – GET /animais/1
router.get("/:id", animaisController.obterAnimalPorId);

// Cadastrar animal – POST /animais  (ADMIN)
router.post(
  "/",
  autenticarToken,
  apenasAdmin,
  uploadFotoAnimal.single("foto"), // campo "foto" virá do formulário
  animaisController.criarAnimal
);

// Atualizar animal – PUT /animais/1 (ADMIN)
router.put(
  "/:id",
  autenticarToken,
  apenasAdmin,
  uploadFotoAnimal.single("foto"),
  animaisController.atualizarAnimal
);

// Deletar animal – DELETE /animais/1 (ADMIN)
router.delete(
  "/:id",
  autenticarToken,
  apenasAdmin,
  animaisController.deletarAnimal
);

module.exports = router;
