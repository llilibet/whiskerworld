require('../database/connection'); // garante que Firebase Admin está inicializado
const admin = require('firebase-admin');

async function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      mensagem: 'Você precisa estar conectado para continuar. Faça login e tente novamente.',
      codigo: 'SESSAO_AUSENTE',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.usuario = {
      id: decoded.uid,
      nome: decoded.nome || decoded.name || decoded.email,
      email: decoded.email,
      tipo: decoded.tipo || 'ADOTANTE',
    };
    next();
  } catch (err) {
    return res.status(401).json({
      mensagem: 'Sua sessão expirou. Faça login novamente para continuar.',
      codigo: 'SESSAO_EXPIRADA',
    });
  }
}

function apenasAdmin(req, res, next) {
  if (!req.usuario || req.usuario.tipo !== 'ADMIN') {
    return res.status(403).json({ mensagem: 'Apenas administradores podem executar esta ação.' });
  }
  next();
}

module.exports = { autenticarToken, apenasAdmin };

