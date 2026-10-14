const usuariosService = require('../services/usuariosService');

function handleError(res, erro) {
  console.error(erro);
  const status = erro.status || 500;
  return res.status(status).json({ mensagem: erro.message || 'Erro interno.' });
}

async function registrarUsuario(req, res) {
  try {
    const resultado = await usuariosService.registrarUsuario(req.body);
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', ...resultado });
  } catch (erro) { return handleError(res, erro); }
}

async function syncGoogleUsuario(req, res) {
  try {
    const { id: uid, email, nome } = req.usuario;
    const tipo = (req.body?.tipo || 'ADOTANTE').toUpperCase();
    const resultado = await usuariosService.syncGoogleUsuario({ uid, email, nome, tipo });
    return res.json(resultado);
  } catch (erro) { return handleError(res, erro); }
}

async function retornaUsuarioLogado(req, res) {
  try {
    if (!req.usuario) return res.status(401).json({ mensagem: 'Não autenticado.' });
    const { id, nome, email, tipo } = req.usuario;
    return res.json({ id, nome, email, tipo });
  } catch (erro) { return handleError(res, erro); }
}

async function excluirUsuario(req, res) {
  try {
    await usuariosService.excluirUsuario(req.usuario?.id);
    return res.json({ mensagem: 'Conta excluída com sucesso.' });
  } catch (erro) { return handleError(res, erro); }
}

module.exports = { registrarUsuario, syncGoogleUsuario, retornaUsuarioLogado, excluirUsuario };