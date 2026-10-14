const assert = require('node:assert/strict');

function respostasInvalidas(respostas) {
  return (
    !respostas ||
    typeof respostas !== 'object' ||
    Array.isArray(respostas)
  );
}

function faltamDadosDoAgendamento(animalId, dataVisita, horaVisita) {
  return !animalId || !dataVisita || !horaVisita;
}

function cabecalhoAutenticacaoInvalido(authHeader) {
  return !authHeader || !authHeader.startsWith('Bearer ');
}

function usuarioNaoEhAdministrador(usuario) {
  return !usuario || usuario.tipo !== 'ADMIN';
}

let total = 0;

function comparar(nome, casos, antes, depois) {
  for (const argumentos of casos) {
    assert.deepStrictEqual(
      depois(...argumentos),
      antes(...argumentos),
      `${nome}: resultado diferente para ${JSON.stringify(argumentos)}`
    );
    total++;
  }

  console.log(`OK - ${nome}: ${casos.length} casos equivalentes`);
}

// R1: validação das respostas do questionário.
const respostas = [
  undefined, null, false, true, 0, 1, '', 'texto', [], {}, { a: 'sim' }
];

comparar(
  'Respostas do questionário',
  respostas.map(valor => [valor]),
  valor => !valor || typeof valor !== 'object' || Array.isArray(valor),
  respostasInvalidas
);

// R2: dados obrigatórios do agendamento.
const valores = [undefined, null, '', 0, false, 'valor'];
const agendamentos = [];

for (const animal of valores) {
  for (const data of valores) {
    for (const hora of valores) {
      agendamentos.push([animal, data, hora]);
    }
  }
}

comparar(
  'Dados obrigatórios do agendamento',
  agendamentos,
  (animal, data, hora) => !animal || !data || !hora,
  faltamDadosDoAgendamento
);

// R3: cabeçalho de autenticação ausente ou em formato incorreto.
const cabecalhos = [
  undefined, null, '', 'Bearer ', 'Bearer token',
  'bearer token', 'Basic token', 'token', ' Bearer token'
];

comparar(
  'Cabeçalho de autenticação',
  cabecalhos.map(valor => [valor]),
  valor => !valor || !valor.startsWith('Bearer '),
  cabecalhoAutenticacaoInvalido
);

// R4: perfil de administrador.
const usuarios = [
  undefined, null, {}, { tipo: 'ADMIN' },
  { tipo: 'ADOTANTE' }, { tipo: 'admin' },
  { tipo: '' }, { tipo: null }
];

comparar(
  'Perfil de administrador',
  usuarios.map(valor => [valor]),
  valor => !valor || valor.tipo !== 'ADMIN',
  usuarioNaoEhAdministrador
);

console.log(`\nTotal: ${total} casos equivalentes.`);
console.log('Todas as comparações passaram.');