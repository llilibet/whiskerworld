'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { calcularCompatibilidade } = require('../src/services/compatibilidadeService');

const AVISO =
  'Esta avaliação usa regras simplificadas, sem validação científica, e não avalia todas as necessidades individuais do animal. O resultado é apenas orientativo, não impede a manifestação de interesse e não substitui a análise dos responsáveis pela adoção.';

const respostasIdeais = {
  tipoMoradia: 'casa',
  permiteAnimais: 'sim',
  espacoAdequado: 'sim',
  temCriancas: 'nao',
  outrosAnimais: 'nao',
  horasSozinho: 'ate4',
  cuidadosDiarios: 'sim',
  condicoesFinanceiras: 'sim',
  experiencia: 'sim',
  concordancia: 'sim',
};

function respostas(alteracoes = {}) {
  return { ...respostasIdeais, ...alteracoes };
}

function assertErro400(fn, mensagem) {
  assert.throws(fn, (err) => {
    assert.equal(err.status, 400);
    assert.equal(err.message, mensagem);
    return true;
  });
}

test('compatibilidade: rejeita respostas ausentes, nulas, não-objeto ou array', () => {
  for (const entrada of [undefined, null, 'texto', 10, []]) {
    assertErro400(
      () => calcularCompatibilidade(entrada),
      'Envie as respostas do questionário.'
    );
  }
});

test('compatibilidade: rejeita o primeiro campo ausente ou inválido, na ordem do questionário', () => {
  assertErro400(
    () => calcularCompatibilidade({}),
    'Resposta obrigatória ausente ou inválida: tipoMoradia.'
  );
  assertErro400(
    () => calcularCompatibilidade(respostas({ horasSozinho: '12h' })),
    'Resposta obrigatória ausente ou inválida: horasSozinho.'
  );
  assertErro400(
    () => calcularCompatibilidade(respostas({ experiencia: undefined, concordancia: 'talvez' })),
    'Resposta obrigatória ausente ou inválida: experiencia.'
  );
});

test('compatibilidade: respostas ideais resultam em nível Alta, 12 pontos e nenhuma orientação', () => {
  assert.deepEqual(calcularCompatibilidade(respostas()), {
    nivel: 'Alta',
    pontuacao: 12,
    pontuacaoMaxima: 12,
    mensagem:
      'Suas respostas indicam condições favoráveis para assumir os cuidados de um animal. Converse com os responsáveis sobre as necessidades específicas do pet escolhido.',
    orientacoes: [],
    aviso: AVISO,
  });
});

test('compatibilidade: limites de pontuação (10 = Alta, 6 = Média, 5 = Baixa)', () => {
  const dez = calcularCompatibilidade(respostas({ horasSozinho: 'mais8' }));
  assert.equal(dez.pontuacao, 10);
  assert.equal(dez.nivel, 'Alta');

  const parciais = {
    permiteAnimais: 'naoSei',
    espacoAdequado: 'adaptar',
    cuidadosDiarios: 'organizar',
    condicoesFinanceiras: 'planejar',
    concordancia: 'conversar',
  };

  const seis = calcularCompatibilidade(respostas({ ...parciais, horasSozinho: 'entre4e8' }));
  assert.equal(seis.pontuacao, 6);
  assert.equal(seis.nivel, 'Média');
  assert.equal(
    seis.mensagem,
    'Sua rotina apresenta pontos que precisam de planejamento. Revise as condições de moradia, tempo e cuidados antes de avançar.'
  );

  const cinco = calcularCompatibilidade(respostas({ ...parciais, horasSozinho: 'mais8' }));
  assert.equal(cinco.pontuacao, 5);
  assert.equal(cinco.nivel, 'Baixa');
});

test('compatibilidade: um campo essencial com "nao" força nível Baixa mesmo com pontuação alta', () => {
  const resultado = calcularCompatibilidade(respostas({ concordancia: 'nao' }));

  assert.equal(resultado.pontuacao, 10);
  assert.equal(resultado.nivel, 'Baixa');
  assert.equal(
    resultado.mensagem,
    'Suas respostas indicam condições que precisam ser revistas antes da adoção. Converse com os responsáveis para entender os cuidados necessários e as possíveis adaptações.'
  );
  assert.deepEqual(resultado.orientacoes, [
    'Converse com todos os moradores antes de assumir a adoção.',
  ]);
});

test('compatibilidade: gera todas as orientações, na ordem esperada', () => {
  const resultado = calcularCompatibilidade({
    tipoMoradia: 'apartamento',
    permiteAnimais: 'nao',
    espacoAdequado: 'nao',
    temCriancas: 'sim',
    outrosAnimais: 'sim',
    horasSozinho: 'mais8',
    cuidadosDiarios: 'nao',
    condicoesFinanceiras: 'nao',
    experiencia: 'nao',
    concordancia: 'nao',
  });

  assert.equal(resultado.pontuacao, 0);
  assert.equal(resultado.nivel, 'Baixa');
  assert.deepEqual(resultado.orientacoes, [
    'Confirme a autorização para manter animais no imóvel.',
    'Prepare um espaço seguro e adequado para o animal.',
    'Planeje companhia, atividades e apoio durante os períodos em que o animal ficará sozinho. A tolerância varia entre animais.',
    'Organize sua rotina para alimentação, higiene, brincadeiras e passeios, quando necessários.',
    'Planeje os gastos com alimentação, cuidados veterinários e emergências.',
    'Converse com todos os moradores antes de assumir a adoção.',
    'Verifique a segurança de janelas, sacadas e áreas de acesso.',
    'Planeje a adaptação e supervisione as interações entre crianças e o animal.',
    'Faça a apresentação aos outros animais de forma gradual e supervisionada.',
    'Busque orientação sobre os cuidados e a adaptação do seu primeiro pet.',
  ]);
});
