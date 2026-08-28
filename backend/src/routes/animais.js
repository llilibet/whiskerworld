const express = require("express");
const router = express.Router();
const animaisController = require("../controllers/animaisController");
const { autenticarToken, apenasAdmin } = require("../middlewares/authMiddleware");
const uploadFotoAnimal = require("../middlewares/uploadFotoAnimal");

function uploadComTratamento(req, res, next) {
  uploadFotoAnimal.single("foto")(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ mensagem: 'A foto deve ter no máximo 2 MB.' });
      }
      return res.status(400).json({ mensagem: err.message });
    }
    next();
  });
}

// Lista todos animais (admin) – GET /animais/admin
router.get("/admin", autenticarToken, apenasAdmin, animaisController.listarAnimaisAdmin);

// Lista animais (público) – GET /animais?tipo=GATO ou CAO
router.get("/", animaisController.listarAnimais);

// Detalhes de um animal – GET /animais/1
router.get("/:id", animaisController.obterAnimalPorId);

// Cadastrar animal – POST /animais  (ADMIN)
router.post(
  "/",
  autenticarToken,
  apenasAdmin,
  uploadComTratamento,
  animaisController.criarAnimal
);

// Atualizar animal – PUT /animais/1 (ADMIN)
router.put(
  "/:id",
  autenticarToken,
  apenasAdmin,
  uploadComTratamento,
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
