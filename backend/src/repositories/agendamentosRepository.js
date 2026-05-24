const { db } = require('../database/connection');
const col = db.collection('agendamentos');

async function findByUsuario(usuarioId) {
  const snap = await col.where('usuario_id', '==', usuarioId).get();
  return snap.docs
    .map(d => {
      const data = d.data();
      return {
        id: d.id,
        data_visita: data.data_visita,
        hora_visita: data.hora_visita,
        status: data.status,
        observacoes: data.observacoes,
        nome_animal: data.nome_animal,
        tipo_animal: data.tipo_animal,
      };
    })
    .sort((a, b) =>
      (a.data_visita || '').localeCompare(b.data_visita || '') ||
      (a.hora_visita || '').localeCompare(b.hora_visita || '')
    );
}

async function findAll() {
  const snap = await col.get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) =>
      (a.data_visita || '').localeCompare(b.data_visita || '') ||
      (a.hora_visita || '').localeCompare(b.hora_visita || '')
    );
}

async function findActiveByUsuarioAndAnimal(usuarioId, animalId) {
  const snap = await col
    .where('usuario_id', '==', usuarioId)
    .where('animal_id', '==', animalId)
    .get();
  return snap.docs
    .filter(d => ['PENDENTE', 'CONFIRMADO'].includes(d.data().status))
    .map(d => ({ id: d.id }));
}

async function create({ usuarioId, animalId, dataVisita, horaVisita, observacoes, nomeAnimal, tipoAnimal, nomeUsuario, emailUsuario,
  telefone, cpf, idadeAdotante,
  tipoMoradia, moradiaPropria, temEspacoExterno, tamanhoMoradia,
  horasSozinho, temOutrosPets, temCriancas, descricaoRotina,
  experienciaPets, temAcessoVeterinario, motivoAdocao
}) {
  const data = {
    usuario_id: usuarioId,
    animal_id: animalId,
    data_visita: dataVisita,
    hora_visita: horaVisita,
    status: 'PENDENTE',
    observacoes: observacoes || null,
    nome_animal: nomeAnimal || '',
    tipo_animal: tipoAnimal || '',
    nome_usuario: nomeUsuario || '',
    email_usuario: emailUsuario || '',
    telefone: telefone || '',
    cpf: cpf || '',
    idade_adotante: idadeAdotante || '',
    tipo_moradia: tipoMoradia || '',
    moradia_propria: moradiaPropria || '',
    tem_espaco_externo: temEspacoExterno || '',
    tamanho_moradia: tamanhoMoradia || '',
    horas_sozinho: horasSozinho || '',
    tem_outros_pets: temOutrosPets || '',
    tem_criancas: temCriancas || '',
    descricao_rotina: descricaoRotina || '',
    experiencia_pets: experienciaPets || '',
    tem_acesso_veterinario: temAcessoVeterinario || '',
    motivo_adocao: motivoAdocao || '',
    criadoEm: new Date().toISOString(),
  };
  const ref = await col.add(data);
  return { id: ref.id, ...data };
}

async function updateStatus(id, status) {
  const doc = await col.doc(id).get();
  if (!doc.exists) return 0;
  await col.doc(id).update({ status: status.toUpperCase() });
  return 1;
}

async function remove(id) {
  const doc = await col.doc(id).get();
  if (!doc.exists) return 0;
  await col.doc(id).delete();
  return 1;
}

async function findOcupadosByData(data) {
  const snap = await col
    .where('data_visita', '==', data)
    .where('status', 'in', ['PENDENTE', 'CONFIRMADO'])
    .get();
  return snap.docs.map(d => d.data().hora_visita);
}

module.exports = { findByUsuario, findAll, findActiveByUsuarioAndAnimal, create, updateStatus, remove, findOcupadosByData };

