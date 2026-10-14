'use strict';

// Testes de caracterização de favoritosService.removerFavorito.
// Criados antes da refatoração "Renomear Variável" (count -> quantidadeRemovida)
// para registrar o comportamento atual e provar que ele não muda.

const test = require('node:test');
const assert = require('node:assert/strict');

const favoritosRepository = require('../src/repositories/favoritosRepository');
const favoritosService = require('../src/services/favoritosService');

test('removerFavorito rejeita com 404 quando o repositório não removeu nenhum registro', async () => {
  favoritosRepository.remove = async () => 0;

  await assert.rejects(
    () => favoritosService.removerFavorito('usuario-1', 'animal-1'),
    (erro) => {
      assert.equal(erro.status, 404);
      assert.equal(erro.message, 'Favorito não encontrado.');
      return true;
    }
  );
});

test('removerFavorito conclui sem erro quando pelo menos um registro foi removido', async () => {
  const chamadas = [];
  favoritosRepository.remove = async (usuarioId, animalId) => {
    chamadas.push([usuarioId, animalId]);
    return 1;
  };

  const resultado = await favoritosService.removerFavorito('usuario-1', 'animal-1');

  assert.equal(resultado, undefined);
  assert.deepEqual(chamadas, [['usuario-1', 'animal-1']]);
});

test('removerFavorito rejeita com 401 quando o usuário não está autenticado', async () => {
  favoritosRepository.remove = async () => {
    throw new Error('o repositório não deveria ser chamado');
  };

  await assert.rejects(
    () => favoritosService.removerFavorito(null, 'animal-1'),
    (erro) => {
      assert.equal(erro.status, 401);
      assert.equal(erro.message, 'Usuário não autenticado.');
      return true;
    }
  );
});

test('removerFavorito rejeita com 400 quando o animal_id não foi informado', async () => {
  favoritosRepository.remove = async () => {
    throw new Error('o repositório não deveria ser chamado');
  };

  await assert.rejects(
    () => favoritosService.removerFavorito('usuario-1', undefined),
    (erro) => {
      assert.equal(erro.status, 400);
      assert.equal(erro.message, 'animal_id obrigatório.');
      return true;
    }
  );
});
