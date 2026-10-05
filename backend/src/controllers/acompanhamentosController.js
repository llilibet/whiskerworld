const acompanhamentosService = require('../services/acompanhamentosService');

async function registrarAcompanhamento(req, res, next) {
  try {
    const acompanhamento =
      await acompanhamentosService.registrarAcompanhamento(
        req.params.adocaoId,
        req.body,
        req.usuario,
        req.file
      );

    return res.status(201).json(acompanhamento);
  } catch (erro) {
    return next(erro);
  }
}

async function listarAcompanhamentos(req, res, next) {
  try {
    const acompanhamentos =
      await acompanhamentosService.listarAcompanhamentos(
        req.params.adocaoId,
        req.usuario
      );

    return res.status(200).json(acompanhamentos);
  } catch (erro) {
    return next(erro);
  }
}

module.exports = {
  registrarAcompanhamento,
  listarAcompanhamentos,
};