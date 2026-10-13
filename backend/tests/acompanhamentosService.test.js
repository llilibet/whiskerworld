'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const adocoesRepository = require('../src/repositories/adocoesRepository');
const acompanhamentosRepository = require('../src/repositories/acompanhamentosRepository');
const acompanhamentosService = require('../src/services/acompanhamentosService');

const adotante = { id: 'u-1', tipo: 'ADOTANTE' };

function prepararAdocaoAprovada() {
  adocoesRepository.buscarPorId = async (id) => ({
    id,
    animal_id: 'a-1',
    usuario_id: 'u-1',
    status: 'APROVADA',
  });
  acompanhamentosRepository.criar = async (dados) => dados;
}

async function assertErro400(dados, mensagem) {
  await assert.rejects(
    acompanhamentosService.registrarAcompanhamento('ad-1', dados, adotante),
    (err) => {
      assert.equal(err.status, 400);
      assert.equal(err.message, mensagem);
      return true;
    }
  );
}

test('acompanhamento: descrição vazia, só com espaços ou não-texto é recusada', async () => {
  prepararAdocaoAprovada();
  for (const descricao of [undefined, '', '    ', 42]) {
    await assertErro400(
      { descricao, data_acompanhamento: '2026-10-01' },
      'A descrição é obrigatória.'
    );
  }
  await assertErro400(undefined, 'A descrição é obrigatória.');
});

test('acompanhamento: descrição acima de 5.000 caracteres é recusada', async () => {
  prepararAdocaoAprovada();
  await assertErro400(
    { descricao: 'a'.repeat(5001), data_acompanhamento: '2026-10-01' },
    'A descrição deve ter no máximo 5.000 caracteres.'
  );
});

test('acompanhamento: descrição é salva sem espaços nas pontas (limite de 5.000 aceito)', async () => {
  prepararAdocaoAprovada();

  const limite = await acompanhamentosService.registrarAcompanhamento(
    'ad-1',
    { descricao: `  ${'a'.repeat(5000)}  `, data_acompanhamento: '2026-10-01' },
    adotante
  );
  assert.equal(limite.descricao.length, 5000);

  const registro = await acompanhamentosService.registrarAcompanhamento(
    'ad-1',
    { descricao: '  Comendo bem.  ', data_acompanhamento: '2026-10-01' },
    adotante
  );
  assert.deepEqual(registro, {
    adocao_id: 'ad-1',
    animal_id: 'a-1',
    usuario_id: 'u-1',
    data_acompanhamento: '2026-10-01',
    descricao: 'Comendo bem.',
  });
});

const outroAdotante = { id: 'u-2', tipo: 'ADOTANTE' };
const administrador = { id: 'admin-1', tipo: 'ADMIN' };

async function assertErro403(acao) {
  await assert.rejects(acao, (err) => {
    assert.equal(err.status, 403);
    assert.equal(
      err.message,
      'Você não tem permissão para acessar este acompanhamento.'
    );
    return true;
  });
}

test('acompanhamento: somente o adotante responsável pode registrar', async () => {
  prepararAdocaoAprovada();
  const dados = { descricao: 'Comendo bem.', data_acompanhamento: '2026-10-01' };

  const registro = await acompanhamentosService.registrarAcompanhamento(
    'ad-1',
    dados,
    adotante
  );
  assert.equal(registro.usuario_id, 'u-1');

  await assertErro403(
    acompanhamentosService.registrarAcompanhamento('ad-1', dados, outroAdotante)
  );
  await assertErro403(
    acompanhamentosService.registrarAcompanhamento('ad-1', dados, administrador)
  );
});

test('acompanhamento: adotante responsável e administrador podem consultar', async () => {
  prepararAdocaoAprovada();
  acompanhamentosRepository.listarPorAdocao = async () => [
    { id: 'r-1', descricao: 'Comendo bem.' },
  ];

  const esperado = [{ id: 'r-1', descricao: 'Comendo bem.' }];

  assert.deepEqual(
    await acompanhamentosService.listarAcompanhamentos('ad-1', adotante),
    esperado
  );
  assert.deepEqual(
    await acompanhamentosService.listarAcompanhamentos('ad-1', administrador),
    esperado
  );

  await assertErro403(
    acompanhamentosService.listarAcompanhamentos('ad-1', outroAdotante)
  );
});
