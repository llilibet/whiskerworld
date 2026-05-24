const favoritosRepository = require('../repositories/favoritosRepository');

async function listarFavoritos(usuarioId) {
  if (!usuarioId) {
    const err = new Error('Usuário não autenticado.');
    err.status = 401;
    throw err;
  }
  return favoritosRepository.findByUsuario(usuarioId);
}

async function criarFavorito(usuarioId, animalId) {
  if (!usuarioId) {
    const err = new Error('Usuário não autenticado.');
    err.status = 401;
    throw err;
  }
  if (!animalId) {
    const err = new Error('animal_id obrigatório.');
    err.status = 400;
    throw err;
  }
  return favoritosRepository.create(usuarioId, animalId);
}

async function removerFavorito(usuarioId, animalId) {
  if (!usuarioId) {
    const err = new Error('Usuário não autenticado.');
    err.status = 401;
    throw err;
  }
  if (!animalId) {
    const err = new Error('animal_id obrigatório.');
    err.status = 400;
    throw err;
  }
  const count = await favoritosRepository.remove(usuarioId, animalId);
  if (!count) {
    const err = new Error('Favorito não encontrado.');
    err.status = 404;
    throw err;
  }
}

module.exports = { listarFavoritos, criarFavorito, removerFavorito };
