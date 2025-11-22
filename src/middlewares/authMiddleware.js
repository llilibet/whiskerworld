const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verifica se o token JWT foi enviado e é válido.
 * Se ok, coloca os dados do usuário em req.usuario.
 */
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não fornecido." });
  }

  const [tipo, token] = authHeader.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ mensagem: "Formato de token inválido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      return res.status(403).json({ mensagem: "Token inválido ou expirado." });
    }

    // usuário vindo do token (id, nome, email, tipo)
    req.usuario = usuario;
    next();
  });
}


// Garante que o usuário autenticado é ADMIN.
function apenasAdmin(req, res, next) {
  if (!req.usuario || req.usuario.tipo !== "ADMIN") {
    return res
      .status(403)
      .json({ mensagem: "Apenas administradores podem executar esta ação." });
  }

  next();
}

module.exports = {
  autenticarToken,
  apenasAdmin,
};
