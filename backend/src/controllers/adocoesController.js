const adocoesService = require('../services/adocoesService');

async function concluirAdocao(req, res, next) {
  try {
    const adocao = await adocoesService.concluirAdocao(
      req.params.agendamentoId,
      req.usuario
    );

    return res.status(201).json(adocao);
  } catch (erro) {
    next(erro);
  }
}

async function listarMinhasAdocoes(req, res, next) {
  try {
    const adocoes = await adocoesService.listarMinhasAdocoes(
      req.usuario
    );

    return res.status(200).json(adocoes);
  } catch (erro) {
    next(erro);
  }
}

module.exports = {
  concluirAdocao,
  listarMinhasAdocoes,
};