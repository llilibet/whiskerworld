const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const { autenticarToken } = require("../middlewares/authMiddleware");

// rota de teste
router.get("/teste", (req, res) => {
  res.send("Rota de usuarios OK");
});

// registrar — backend cria o usuário no Firebase Auth + Firestore e retorna customToken
router.post("/registro", usuariosController.registrarUsuario);

// sync Google — garante doc no Firestore + custom claims para novos usuários Google
router.post("/google-sync", autenticarToken, usuariosController.syncGoogleUsuario);

// retorna informações do usuário autenticado
router.get("/me", autenticarToken, usuariosController.retornaUsuarioLogado);

module.exports = router;

