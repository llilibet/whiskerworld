const favoritosRepository = require('../repositories/favoritosRepository');
const AppError = require('../errors/AppError');

async function listarFavoritos(usuarioId) {
  if (!usuarioId) {
    throw new AppError('Usuário não autenticado.', 401);
  }
  return favoritosRepository.findByUsuario(usuarioId);
}

async function criarFavorito(usuarioId, animalId) {
  if (!usuarioId) {
    throw new AppError('Usuário não autenticado.', 401);
  }
  if (!animalId) {
    throw new AppError('animal_id obrigatório.', 400);
  }
  return favoritosRepository.create(usuarioId, animalId);
}

async function removerFavorito(usuarioId, animalId) {
  if (!usuarioId) {
    throw new AppError('Usuário não autenticado.', 401);
  }
  if (!animalId) {
    throw new AppError('animal_id obrigatório.', 400);
  }
  const count = await favoritosRepository.remove(usuarioId, animalId);
  if (!count) {
    throw new AppError('Favorito não encontrado.', 404);
  }
}

module.exports = { listarFavoritos, criarFavorito, removerFavorito };
