const agendamentosRepository = require('../repositories/agendamentosRepository');
const animaisRepository = require('../repositories/animaisRepository');

function validarDataVisita(dataVisita) {
  if (!dataVisita) return;

  const data = new Date(`${dataVisita}T00:00:00`);
  if (Number.isNaN(data.getTime())) {
    const err = new Error('Data de visita inválida. Use o formato YYYY-MM-DD.');
    err.status = 400;
    throw err;
  }

  if (data.getDay() === 0) {
    const err = new Error('Agendamentos só podem ser realizados de segunda a sábado. Domingos estão indisponíveis.');
    err.status = 400;
    throw err;
  }
}

async function criarAgendamento({ usuarioId, animal_id, data_visita, hora_visita, observacoes, nomeUsuario, emailUsuario,
  telefone, cpf, idade_adotante,
  tipo_moradia, moradia_propria, tem_espaco_externo, tamanho_moradia,
  horas_sozinho, tem_outros_pets, tem_criancas, descricao_rotina,
  experiencia_pets, tem_acesso_veterinario, motivo_adocao
}) {
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

  validarDataVisita(data_visita);

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

  const ocupados = await agendamentosRepository.findOcupadosByData(data_visita);
  if (ocupados.includes(hora_visita)) {
    const err = new Error('Este horário já está ocupado para a data selecionada. Escolha outro horário.');
    err.status = 409;
    throw err;
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
    const err = new Error('Status é obrigatório.');
    err.status = 400;
    throw err;
  }
  const agendamento = await agendamentosRepository.findById(id);
  if (!agendamento) {
    const err = new Error('Agendamento não encontrado.');
    err.status = 404;
    throw err;
  }
  const animal = await animaisRepository.findById(agendamento.animal_id);
  if (!animal || animal.cadastradoPor !== adminId) {
    const err = new Error('Acesso negado. Este agendamento não pertence a um animal que você cadastrou.');
    err.status = 403;
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
