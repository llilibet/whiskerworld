const animaisService = require('../services/animaisService');

function handleError(res, err) {
  console.error(err);
  return res.status(err.status || 500).json({ mensagem: err.message || 'Erro interno.' });
}

async function listarAnimais(req, res) {
  try {
    const animais = await animaisService.listarAnimais(req.query.tipo);
    return res.json(animais);
  } catch (err) { return handleError(res, err); }
}

async function listarAnimaisAdmin(req, res) {
  try {
    const animais = await animaisService.listarAnimaisAdmin(req.usuario.id);
    return res.json(animais);
  } catch (err) { return handleError(res, err); }
}

async function obterAnimalPorId(req, res) {
  try {
    const animal = await animaisService.obterAnimalPorId(req.params.id);
    return res.json(animal);
  } catch (err) { return handleError(res, err); }
}

async function criarAnimal(req, res) {
  try {
    const animal = await animaisService.criarAnimal(
      { ...req.body, cadastradoPor: req.usuario.id },
      req.file
    );
    return res.status(201).json({ mensagem: 'Animal cadastrado com sucesso.', animal });
  } catch (err) { return handleError(res, err); }
}

async function atualizarAnimal(req, res) {
  try {
    await animaisService.atualizarAnimal(req.params.id, req.body, req.file, req.usuario.id);
    return res.json({ mensagem: 'Animal atualizado com sucesso.' });
  } catch (err) { return handleError(res, err); }
}

async function deletarAnimal(req, res) {
  try {
    await animaisService.deletarAnimal(req.params.id, req.usuario.id);
    return res.json({ mensagem: 'Animal removido com sucesso.' });
  } catch (err) { return handleError(res, err); }
}

module.exports = {
  listarAnimais,
  listarAnimaisAdmin,
  obterAnimalPorId,
  criarAnimal,
  atualizarAnimal,
  deletarAnimal,
};