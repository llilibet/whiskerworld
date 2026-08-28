const favoritosService = require('../services/favoritosService');

function handleError(res, err) {
  console.error(err);
  const status = err.status || (err.code === '23505' ? 409 : 500);
  return res.status(status).json({ mensagem: err.message || 'Erro interno.' });
}

async function listarFavoritos(req, res) {
  try {
    const list = await favoritosService.listarFavoritos(req.usuario?.id);
    return res.json(list);
  } catch (err) { return handleError(res, err); }
}

async function criarFavorito(req, res) {
  try {
    const fav = await favoritosService.criarFavorito(req.usuario?.id, req.body.animal_id);
    return res.status(201).json({ mensagem: 'Favorito criado.', id: fav.id });
  } catch (err) { return handleError(res, err); }
}

async function removerFavorito(req, res) {
  try {
    await favoritosService.removerFavorito(req.usuario?.id, req.params.animal_id);
    return res.json({ mensagem: 'Favorito removido com sucesso.' });
  } catch (err) { return handleError(res, err); }
}

module.exports = { listarFavoritos, criarFavorito, removerFavorito };
