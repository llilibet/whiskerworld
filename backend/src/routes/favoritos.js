const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritosController");
const { autenticarToken } = require("../middlewares/authMiddleware");

// Retorna favoritos do usuário autenticado
router.get("/", autenticarToken, favoritosController.listarFavoritos);

// Criar favorito (opcional se já tiver)
router.post("/", autenticarToken, favoritosController.criarFavorito);

// Remover favorito – DELETE /favoritos/:animal_id
router.delete(
  "/:animal_id",
  autenticarToken,
  favoritosController.removerFavorito
);

module.exports = router;
