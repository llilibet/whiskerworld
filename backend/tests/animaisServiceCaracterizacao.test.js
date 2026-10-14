'use strict';

// Testes de caracterização de animaisService (criarAnimal, atualizarAnimal, deletarAnimal).
// Criados antes da refatoração "Renomear Variável" (body -> dadosNovoAnimal / dadosAtualizacao
// e count -> quantidadeRemovida) para registrar o comportamento atual e provar que ele não muda.

const test = require('node:test');
const assert = require('node:assert/strict');

const databaseConnection = require('../src/database/connection');
const animaisRepository = require('../src/repositories/animaisRepository');

const servicePath = require.resolve('../src/services/animaisService');

delete require.cache[servicePath];
databaseConnection.salvarFotoNoStorage = async () => 'https://fake.url/foto.jpg';
const animaisService = require('../src/services/animaisService');

const arquivo = { originalname: 'foto.jpg' };

function dadosValidos(extra = {}) {
  return {
    nome: 'Luna',
    sexo: 'femea',
    tipo: 'gato',
    idade: '2',
    porte: 'PEQUENO',
    descricao: 'Descrição válida',
    historico: 'Histórico válido',
    ...extra,
  };
}

// ---------- criarAnimal (R2) ----------

test('criarAnimal repassa os dados ao repositório com tipo e sexo em maiúsculas', async () => {
  let recebido;
  animaisRepository.create = async (dados) => { recebido = dados; return { id: 'novo' }; };

  const retorno = await animaisService.criarAnimal(dadosValidos(), arquivo);

  assert.deepEqual(retorno, { id: 'novo' });
  assert.equal(recebido.nome, 'Luna');
  assert.equal(recebido.tipo, 'GATO');
  assert.equal(recebido.sexo, 'FEMEA');
  assert.equal(recebido.idade, '2');
  assert.equal(recebido.porte, 'PEQUENO');
  assert.equal(recebido.historico, 'Histórico válido');
  assert.equal(recebido.foto_url, 'https://fake.url/foto.jpg');
  assert.equal(recebido.cadastradoPor, null);
});

test('criarAnimal usa o cadastradoPor informado', async () => {
  let recebido;
  animaisRepository.create = async (dados) => { recebido = dados; return {}; };

  await animaisService.criarAnimal(dadosValidos({ cadastradoPor: 'admin-1' }), arquivo);

  assert.equal(recebido.cadastradoPor, 'admin-1');
});

test('criarAnimal interpreta vacinado como verdadeiro para "1", "true" e true', async () => {
  const recebidos = [];
  animaisRepository.create = async (dados) => { recebidos.push(dados.vacinado); return {}; };

  for (const valor of ['1', 'true', true]) {
    await animaisService.criarAnimal(dadosValidos({ vacinado: valor }), arquivo);
  }

  assert.deepEqual(recebidos, [true, true, true]);
});

test('criarAnimal interpreta vacinado como falso para outros valores ou ausência', async () => {
  const recebidos = [];
  animaisRepository.create = async (dados) => { recebidos.push(dados.vacinado); return {}; };

  for (const valor of ['0', 'false', false, undefined]) {
    await animaisService.criarAnimal(dadosValidos({ vacinado: valor }), arquivo);
  }

  assert.deepEqual(recebidos, [false, false, false, false]);
});

test('criarAnimal lista todos os campos obrigatórios ausentes em um único erro 400', async () => {
  animaisRepository.create = async () => ({});

  await assert.rejects(
    () => animaisService.criarAnimal({ nome: 'Luna' }, undefined),
    (erro) => {
      assert.equal(erro.status, 400);
      assert.equal(
        erro.message,
        'Campos obrigatórios ausentes: espécie, idade, porte, descrição, histórico, foto.'
      );
      return true;
    }
  );
});

// ---------- atualizarAnimal (R3) ----------

const animalAtual = {
  id: 'a1',
  nome: 'Rex',
  idade: '5',
  sexo: 'MACHO',
  vacinado: true,
  status: 'DISPONIVEL',
  tipo: 'CAO',
  descricao: 'descrição atual',
  raca: 'SRD',
  porte: 'GRANDE',
  historico: 'histórico atual',
  foto_url: 'https://fake.url/atual.jpg',
  cadastradoPor: 'admin-1',
};

test('atualizarAnimal mantém todos os valores atuais quando nenhum dado novo é enviado', async () => {
  let atualizado;
  animaisRepository.findById = async () => animalAtual;
  animaisRepository.update = async (id, dados) => { atualizado = { id, dados }; };

  await animaisService.atualizarAnimal('a1', {}, undefined, 'admin-1');

  assert.equal(atualizado.id, 'a1');
  assert.deepEqual(atualizado.dados, {
    nome: 'Rex',
    idade: '5',
    sexo: 'MACHO',
    vacinado: true,
    status: 'DISPONIVEL',
    tipo: 'CAO',
    descricao: 'descrição atual',
    raca: 'SRD',
    porte: 'GRANDE',
    historico: 'histórico atual',
    foto_url: 'https://fake.url/atual.jpg',
  });
});

test('atualizarAnimal aplica os dados enviados e normaliza os campos em maiúsculas', async () => {
  let atualizado;
  animaisRepository.findById = async () => animalAtual;
  animaisRepository.update = async (id, dados) => { atualizado = dados; };

  await animaisService.atualizarAnimal('a1', {
    nome: 'Thor',
    idade: '6',
    sexo: 'femea',
    status: 'adotado',
    tipo: 'gato',
    vacinado: '0',
    descricao: 'nova descrição',
    raca: 'Siamês',
    porte: 'PEQUENO',
    historico: 'novo histórico',
  }, arquivo, 'admin-1');

  assert.deepEqual(atualizado, {
    nome: 'Thor',
    idade: '6',
    sexo: 'FEMEA',
    vacinado: false,
    status: 'ADOTADO',
    tipo: 'GATO',
    descricao: 'nova descrição',
    raca: 'Siamês',
    porte: 'PEQUENO',
    historico: 'novo histórico',
    foto_url: 'https://fake.url/foto.jpg',
  });
});

test('atualizarAnimal rejeita com 404 quando o animal não existe', async () => {
  animaisRepository.findById = async () => null;

  await assert.rejects(
    () => animaisService.atualizarAnimal('x', {}, undefined, 'admin-1'),
    (erro) => {
      assert.equal(erro.status, 404);
      assert.equal(erro.message, 'Animal não encontrado.');
      return true;
    }
  );
});

test('atualizarAnimal rejeita com 403 quando outro administrador cadastrou o animal', async () => {
  animaisRepository.findById = async () => animalAtual;

  await assert.rejects(
    () => animaisService.atualizarAnimal('a1', {}, undefined, 'admin-2'),
    (erro) => {
      assert.equal(erro.status, 403);
      assert.equal(erro.message, 'Você não tem permissão para editar este animal.');
      return true;
    }
  );
});

// ---------- deletarAnimal (R5) ----------

test('deletarAnimal remove o animal quando o repositório confirma a remoção', async () => {
  let idRemovido;
  animaisRepository.findById = async () => animalAtual;
  animaisRepository.remove = async (id) => { idRemovido = id; return 1; };

  const resultado = await animaisService.deletarAnimal('a1', 'admin-1');

  assert.equal(resultado, undefined);
  assert.equal(idRemovido, 'a1');
});

test('deletarAnimal rejeita com 404 quando o repositório não removeu nenhum registro', async () => {
  animaisRepository.findById = async () => animalAtual;
  animaisRepository.remove = async () => 0;

  await assert.rejects(
    () => animaisService.deletarAnimal('a1', 'admin-1'),
    (erro) => {
      assert.equal(erro.status, 404);
      assert.equal(erro.message, 'Animal não encontrado.');
      return true;
    }
  );
});

test('deletarAnimal rejeita com 404 quando o animal não existe', async () => {
  animaisRepository.findById = async () => null;
  animaisRepository.remove = async () => {
    throw new Error('o repositório não deveria remover');
  };

  await assert.rejects(
    () => animaisService.deletarAnimal('x', 'admin-1'),
    (erro) => {
      assert.equal(erro.status, 404);
      return true;
    }
  );
});

test('deletarAnimal rejeita com 403 quando outro administrador cadastrou o animal', async () => {
  animaisRepository.findById = async () => animalAtual;
  animaisRepository.remove = async () => {
    throw new Error('o repositório não deveria remover');
  };

  await assert.rejects(
    () => animaisService.deletarAnimal('a1', 'admin-2'),
    (erro) => {
      assert.equal(erro.status, 403);
      assert.equal(erro.message, 'Você não tem permissão para remover este animal.');
      return true;
    }
  );
});
