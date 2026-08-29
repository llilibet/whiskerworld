'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const agendamentosRepository = require('../src/repositories/agendamentosRepository');
const animaisRepository = require('../src/repositories/animaisRepository');
const agendamentosService = require('../src/services/agendamentosService');

test('deve rejeitar agendamento em domingo', async () => {
  animaisRepository.findById = async () => ({
    id: 1,
    nome: 'Luna',
    tipo: 'Cachorro',
  });

  agendamentosRepository.findActiveByUsuarioAndAnimal = async () => [];
  agendamentosRepository.findOcupadosByData = async () => [];
  agendamentosRepository.create = async () => ({ ok: true });

  await assert.rejects(
    () => agendamentosService.criarAgendamento({
      usuarioId: 7,
      animal_id: 1,
      data_visita: '2026-08-30',
      hora_visita: '14:00',
    }),
    (err) => {
      assert.equal(err.status, 400);
      assert.match(err.message, /domingo/i);
      return true;
    }
  );
});

test('deve permitir agendamento em sábado', async () => {
  animaisRepository.findById = async () => ({
    id: 1,
    nome: 'Luna',
    tipo: 'Cachorro',
  });

  agendamentosRepository.findActiveByUsuarioAndAnimal = async () => [];
  agendamentosRepository.findOcupadosByData = async () => [];
  agendamentosRepository.create = async (payload) => payload;

  const agendamento = await agendamentosService.criarAgendamento({
    usuarioId: 7,
    animal_id: 1,
    data_visita: '2026-08-29',
    hora_visita: '14:00',
  });

  assert.equal(agendamento.dataVisita, '2026-08-29');
  assert.equal(agendamento.horaVisita, '14:00');
});
