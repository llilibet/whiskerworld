const {
  calcularCompatibilidade,
} = require('../services/compatibilidadeService');

const animaisRepository = require('../repositories/animaisRepository');
const AppError = require('../errors/AppError');

async function avaliarCompatibilidade(req, res, next) {
  try {
    const { animalId } = req.params;

    const animal = await animaisRepository.findById(animalId);

    if (!animal) {
      throw new AppError('Animal não encontrado.', 404);
    }

    const resultado = calcularCompatibilidade(req.body.respostas);

    return res.status(200).json({
      animalId,
      nomeAnimal: animal.nome,
      ...resultado,
    });
  } catch (erro) {
    next(erro);
  }
}

module.exports = { avaliarCompatibilidade };