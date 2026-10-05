const adocoesRepository = require('../repositories/adocoesRepository');
const AppError = require('../errors/AppError');

async function concluirAdocao(agendamentoId, usuario) {
  if (!usuario || !usuario.id) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  if (usuario.tipo !== 'ADMIN') {
    throw new AppError('Acesso permitido somente ao administrador.', 403);
  }

  if (
    typeof agendamentoId !== 'string' ||
    !agendamentoId.trim() ||
    agendamentoId.includes('/')
  ) {
    throw new AppError('Identificação do agendamento inválida.', 400);
  }

  return adocoesRepository.concluirPorAgendamento(
    agendamentoId,
    usuario.id
  );
}

async function listarMinhasAdocoes(usuario) {
  if (!usuario || !usuario.id) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  if (usuario.tipo !== 'ADOTANTE') {
    throw new AppError('Acesso permitido somente ao adotante.', 403);
  }

  return adocoesRepository.listarPorAdotante(usuario.id);
}

module.exports = {
  concluirAdocao,
  listarMinhasAdocoes,
};