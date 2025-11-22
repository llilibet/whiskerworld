const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// rota de teste opcional
router.get("/teste", (req, res) => {
  res.send("Rota de usuarios OK");
});

// registro de usuário (POST /usuarios/registro)
router.post("/registro", usuariosController.registrarUsuario);

// login de usuário (POST /usuarios/login)
router.post("/login", usuariosController.loginUsuario);

module.exports = router;
