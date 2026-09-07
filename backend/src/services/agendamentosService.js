const agendamentosRepository = require('../repositories/agendamentosRepository');
const animaisRepository = require('../repositories/animaisRepository');
const AppError = require('../errors/AppError');

function validarDataVisita(dataVisita) {
  if (!dataVisita) return;

  const data = new Date(`${dataVisita}T00:00:00`);
  if (Number.isNaN(data.getTime())) {
    throw new AppError('Data de visita inválida. Use o formato YYYY-MM-DD.', 400);
  }

  if (data.getDay() === 0) {
    throw new AppError('Agendamentos só podem ser realizados de segunda a sábado. Domingos estão indisponíveis.', 400);
  }
}

async function criarAgendamento({ usuarioId, animal_id, data_visita, hora_visita, observacoes, nomeUsuario, emailUsuario,
  telefone, cpf, idade_adotante,
  tipo_moradia, moradia_propria, tem_espaco_externo, tamanho_moradia,
  horas_sozinho, tem_outros_pets, tem_criancas, descricao_rotina,
  experiencia_pets, tem_acesso_veterinario, motivo_adocao
}) {
  if (!usuarioId) {
    throw new AppError('Usuário não autenticado.', 401);
  }
  if (!animal_id || !data_visita || !hora_visita) {
    throw new AppError('animal_id, data_visita e hora_visita são obrigatórios.', 400);
  }

  validarDataVisita(data_visita);

  const animal = await animaisRepository.findById(animal_id);
  if (!animal) {
    throw new AppError('Animal não encontrado.', 404);
  }

  const existente = await agendamentosRepository.findActiveByUsuarioAndAnimal(usuarioId, animal_id);
  if (existente.length > 0) {
    throw new AppError('Você já possui um agendamento ativo para este animal.', 400);
  }

  const ocupados = await agendamentosRepository.findOcupadosByData(data_visita);
  if (ocupados.includes(hora_visita)) {
    throw new AppError('Este horário já está ocupado para a data selecionada. Escolha outro horário.', 409);
  }

  return agendamentosRepository.create({
    usuarioId,
    animalId: animal_id,
    dataVisita: data_visita,
    horaVisita: hora_visita,
    observacoes,
    nomeAnimal: animal.nome,
    tipoAnimal: animal.tipo,
    nomeUsuario: nomeUsuario || '',
    emailUsuario: emailUsuario || '',
    telefone: telefone || '',
    cpf: cpf || '',
    idadeAdotante: idade_adotante || '',
    tipoMoradia: tipo_moradia || '',
    moradiaPropria: moradia_propria || '',
    temEspacoExterno: tem_espaco_externo || '',
    tamanhoMoradia: tamanho_moradia || '',
    horasSozinho: horas_sozinho || '',
    temOutrosPets: tem_outros_pets || '',
    temCriancas: tem_criancas || '',
    descricaoRotina: descricao_rotina || '',
    experienciaPets: experiencia_pets || '',
    temAcessoVeterinario: tem_acesso_veterinario || '',
    motivoAdocao: motivo_adocao || '',
  });
}

async function listarMeusAgendamentos(usuarioId) {
  return agendamentosRepository.findByUsuario(usuarioId);
}

async function listarTodosAgendamentos(adminId) {
  return agendamentosRepository.findByAdmin(adminId);
}

async function atualizarStatus(id, status, adminId) {
  if (!status) {
    throw new AppError('Status é obrigatório.', 400);
  }
  const agendamento = await agendamentosRepository.findById(id);
  if (!agendamento) {
    throw new AppError('Agendamento não encontrado.', 404);
  }
  const animal = await animaisRepository.findById(agendamento.animal_id);
  if (!animal || animal.cadastradoPor !== adminId) {
    throw new AppError('Acesso negado. Este agendamento não pertence a um animal que você cadastrou.', 403);
  }
  const count = await agendamentosRepository.updateStatus(id, status);
  if (!count) {
    throw new AppError('Agendamento não encontrado.', 404);
  }
}

async function deletarAgendamento(id) {
  const count = await agendamentosRepository.remove(id);
  if (!count) {
    throw new AppError('Agendamento não encontrado.', 404);
  }
}

async function listarHorariosOcupados(data) {
  return agendamentosRepository.findOcupadosByData(data);
}

module.exports = {
  criarAgendamento,
  listarMeusAgendamentos,
  listarTodosAgendamentos,
  atualizarStatus,
  deletarAgendamento,
  listarHorariosOcupados,
};
