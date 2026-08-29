'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const databaseConnection = require('../src/database/connection');
const animaisRepository = require('../src/repositories/animaisRepository');

const servicePath = require.resolve('../src/services/animaisService');

delete require.cache[servicePath];
databaseConnection.salvarFotoNoStorage = async () => 'https://fake.url/foto.jpg';
const animaisService = require('../src/services/animaisService');

test('deve rejeitar nome de animal composto apenas por espaços', async () => {
  animaisRepository.create = async () => ({ ok: true });

  await assert.rejects(
    () => animaisService.criarAnimal({
      nome: '   ',
      tipo: 'CACHORRO',
      idade: '2',
      porte: 'MEDIO',
      descricao: 'Descrição válida',
      historico: 'Histórico válido',
      cadastradoPor: 'admin-1',
    }, { originalname: 'foto.jpg' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.match(err.message, /nome do animal|apenas letras|letras e espaços/i);
      return true;
    }
  );
});

test('deve rejeitar nome de animal com aspas e caracteres especiais', async () => {
  animaisRepository.create = async () => ({ ok: true });

  await assert.rejects(
    () => animaisService.criarAnimal({
      nome: '"Luna"',
      tipo: 'CACHORRO',
      idade: '2',
      porte: 'MEDIO',
      descricao: 'Descrição válida',
      historico: 'Histórico válido',
      cadastradoPor: 'admin-1',
    }, { originalname: 'foto.jpg' }),
    (err) => {
      assert.equal(err.status, 400);
      assert.match(err.message, /apenas letras|letras e espaços/i);
      return true;
    }
  );
});

test('deve aceitar nome de animal com letras e espaços', async () => {
  animaisRepository.create = async (payload) => payload;

  const animal = await animaisService.criarAnimal({
    nome: 'Luna da Silva',
    tipo: 'CACHORRO',
    idade: '2',
    porte: 'MEDIO',
    descricao: 'Descrição válida',
    historico: 'Histórico válido',
    cadastradoPor: 'admin-1',
  }, { originalname: 'foto.jpg' });

  assert.equal(animal.nome, 'Luna da Silva');
});
