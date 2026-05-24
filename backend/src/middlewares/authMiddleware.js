require('../database/connection'); // garante que Firebase Admin está inicializado
const admin = require('firebase-admin');

async function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
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
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

function apenasAdmin(req, res, next) {
  if (!req.usuario || req.usuario.tipo !== 'ADMIN') {
    return res.status(403).json({ mensagem: 'Apenas administradores podem executar esta ação.' });
  }
  next();
}

module.exports = { autenticarToken, apenasAdmin };

