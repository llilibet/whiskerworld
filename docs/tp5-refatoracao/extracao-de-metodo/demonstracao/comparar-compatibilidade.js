'use strict';

// Demonstração de que a Extração de Método não alterou o comportamento externo
// de calcularCompatibilidade.
//
// O script executa a função para TODAS as combinações válidas de respostas do
// questionário (17.496 combinações) e para um conjunto de entradas inválidas,
// e imprime um hash SHA-256 de todas as saídas. Rodando o script na versão
// anterior e na versão posterior à refatoração, o hash deve ser o mesmo.
//
// Uso (na raiz do repositório):
//   node docs/tp5-refatoracao/extracao-de-metodo/demonstracao/comparar-compatibilidade.js

const crypto = require('crypto');
const path = require('path');

const { calcularCompatibilidade } = require(
  path.resolve(__dirname, '../../../../backend/src/services/compatibilidadeService')
);

const opcoes = {
  tipoMoradia: ['casa', 'apartamento', 'outro'],
  permiteAnimais: ['sim', 'nao', 'naoSei'],
  espacoAdequado: ['sim', 'adaptar', 'nao'],
  temCriancas: ['sim', 'nao'],
  outrosAnimais: ['sim', 'nao'],
  horasSozinho: ['ate4', 'entre4e8', 'mais8'],
  cuidadosDiarios: ['sim', 'organizar', 'nao'],
  condicoesFinanceiras: ['sim', 'planejar', 'nao'],
  experiencia: ['sim', 'nao'],
  concordancia: ['sim', 'conversar', 'nao'],
};

function* combinacoes(campos, atual = {}) {
  if (campos.length === 0) {
    yield { ...atual };
    return;
  }
  const [campo, ...resto] = campos;
  for (const valor of opcoes[campo]) {
    atual[campo] = valor;
    yield* combinacoes(resto, atual);
  }
}

function executar(entrada) {
  try {
    return { ok: calcularCompatibilidade(entrada) };
  } catch (erro) {
    return { erro: erro.message, status: erro.status };
  }
}

const entradasInvalidas = [
  undefined,
  null,
  [],
  'texto',
  {},
  { tipoMoradia: 'casa' },
  { ...Object.fromEntries(Object.entries(opcoes).map(([c, v]) => [c, v[0]])), horasSozinho: '12h' },
];

const hash = crypto.createHash('sha256');
const porNivel = { Alta: 0, Média: 0, Baixa: 0 };
let total = 0;

for (const entrada of combinacoes(Object.keys(opcoes))) {
  const saida = executar(entrada);
  porNivel[saida.ok.nivel] += 1;
  hash.update(JSON.stringify([entrada, saida]));
  total += 1;
}

for (const entrada of entradasInvalidas) {
  hash.update(JSON.stringify([entrada ?? null, executar(entrada)]));
}

console.log(`Combinações válidas avaliadas: ${total}`);
console.log(`Entradas inválidas avaliadas: ${entradasInvalidas.length}`);
console.log(`Distribuição por nível: ${JSON.stringify(porNivel)}`);
console.log(`SHA-256 de todas as saídas: ${hash.digest('hex')}`);
