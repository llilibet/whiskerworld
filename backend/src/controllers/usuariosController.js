const usuariosService = require('../services/usuariosService');

function handleError(res, err) {
  console.error(err);
  const status = err.status || (err.code === 'ER_DUP_ENTRY' ? 409 : 500);
  return res.status(status).json({ mensagem: err.message || 'Erro interno.' });
}

async function registrarUsuario(req, res) {
  try {
    const usuario = await usuariosService.registrarUsuario(req.body);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario });
  } catch (err) { return handleError(res, err); }
}

async function loginUsuario(req, res) {
  try {
    const result = await usuariosService.loginUsuario(req.body);
    return res.status(200).json({ mensagem: 'Login realizado com sucesso.', ...result });
  } catch (err) { return handleError(res, err); }
}

async function retornaUsuarioLogado(req, res) {
  try {
    if (!req.usuario) return res.status(401).json({ mensagem: 'Não autenticado.' });
    const { id, nome, email, tipo } = req.usuario;
    return res.json({ id, nome, email, tipo });
  } catch (err) { return handleError(res, err); }
}

module.exports = { registrarUsuario, loginUsuario, retornaUsuarioLogado };
