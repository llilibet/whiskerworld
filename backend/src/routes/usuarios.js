const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const { autenticarToken } = require("../middlewares/authMiddleware");

// rota de teste
router.get("/teste", (req, res) => {
  res.send("Rota de usuarios OK");
});

// registrar
router.post("/registro", usuariosController.registrarUsuario);

// login
router.post("/login", usuariosController.loginUsuario);

// retorna informações do usuário autenticado
router.get("/me", autenticarToken, usuariosController.retornaUsuarioLogado);

module.exports = router;
