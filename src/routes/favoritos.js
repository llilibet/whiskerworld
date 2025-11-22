const express = require("express");
const router = express.Router();
const favoritosController = require("../controllers/favoritosController");
const { autenticarToken } = require("../middlewares/authMiddleware");

// Adicionar favorito – POST /favoritos
router.post("/", autenticarToken, favoritosController.adicionarFavorito);

// Listar meus favoritos – GET /favoritos/me
router.get("/me", autenticarToken, favoritosController.listarMeusFavoritos);

// Remover favorito – DELETE /favoritos/:animal_id
router.delete(
  "/:animal_id",
  autenticarToken,
  favoritosController.removerFavorito
);

module.exports = router;
