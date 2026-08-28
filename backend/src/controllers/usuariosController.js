const usuariosService = require('../services/usuariosService');

function handleError(res, err) {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({ mensagem: err.message || 'Erro interno.' });
}

async function registrarUsuario(req, res) {
  try {
    const result = await usuariosService.registrarUsuario(req.body);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', ...result });
  } catch (err) { return handleError(res, err); }
}

async function syncGoogleUsuario(req, res) {
  try {
    const { id: uid, email, nome } = req.usuario;
    const tipo = (req.body?.tipo || 'ADOTANTE').toUpperCase();
    const result = await usuariosService.syncGoogleUsuario({ uid, email, nome, tipo });
    return res.json(result);
  } catch (err) { return handleError(res, err); }
}

async function retornaUsuarioLogado(req, res) {
  try {
    if (!req.usuario) return res.status(401).json({ mensagem: 'Não autenticado.' });
    const { id, nome, email, tipo } = req.usuario;
    return res.json({ id, nome, email, tipo });
  } catch (err) { return handleError(res, err); }
}

module.exports = { registrarUsuario, syncGoogleUsuario, retornaUsuarioLogado };
