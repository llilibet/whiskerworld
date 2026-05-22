const agendamentosRepository = require('../repositories/agendamentosRepository');
const animaisRepository = require('../repositories/animaisRepository');

async function criarAgendamento({ usuarioId, animal_id, data_visita, hora_visita, observacoes }) {
  if (!usuarioId) {
    const err = new Error('Usuário não autenticado.');
    err.status = 401;
    throw err;
  }
  if (!animal_id || !data_visita || !hora_visita) {
    const err = new Error('animal_id, data_visita e hora_visita são obrigatórios.');
    err.status = 400;
    throw err;
  }

  const animal = await animaisRepository.findById(animal_id);
  if (!animal) {
    const err = new Error('Animal não encontrado.');
    err.status = 404;
    throw err;
  }

  const existente = await agendamentosRepository.findActiveByUsuarioAndAnimal(usuarioId, animal_id);
  if (existente.length > 0) {
    const err = new Error('Você já possui um agendamento ativo para este animal.');
    err.status = 400;
    throw err;
  }

  return agendamentosRepository.create({
    usuarioId,
    animalId: animal_id,
    dataVisita: data_visita,
    horaVisita: hora_visita,
    observacoes,
  });
}

async function listarMeusAgendamentos(usuarioId) {
  return agendamentosRepository.findByUsuario(usuarioId);
}

async function listarTodosAgendamentos() {
  return agendamentosRepository.findAll();
}

async function atualizarStatus(id, status) {
  if (!status) {
    const err = new Error('Status é obrigatório.');
    err.status = 400;
    throw err;
  }
  const count = await agendamentosRepository.updateStatus(id, status);
  if (!count) {
    const err = new Error('Agendamento não encontrado.');
    err.status = 404;
    throw err;
  }
}

async function deletarAgendamento(id) {
  const count = await agendamentosRepository.remove(id);
  if (!count) {
    const err = new Error('Agendamento não encontrado.');
    err.status = 404;
    throw err;
  }
}

module.exports = {
  criarAgendamento,
  listarMeusAgendamentos,
  listarTodosAgendamentos,
  atualizarStatus,
  deletarAgendamento,
};
