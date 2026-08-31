const animaisRepository = require('../repositories/animaisRepository');
const { salvarFotoNoStorage } = require('../database/connection');

function validarNomeAnimal(nome) {
  const nomeNormalizado = String(nome || '').trim();

  if (!nomeNormalizado) {
    const err = new Error('O nome do animal é obrigatório.');
    err.status = 400;
    throw err;
  }

  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/u.test(nomeNormalizado)) {
    const err = new Error('O nome do animal deve conter apenas letras e espaços.');
    err.status = 400;
    throw err;
  }

  return nomeNormalizado;
}

async function listarAnimais(tipo) {
  return animaisRepository.findAll(tipo);
}

async function listarAnimaisAdmin(adminId) {
  return animaisRepository.findAllAdmin(adminId);
}

async function obterAnimalPorId(id) {
  const animal = await animaisRepository.findById(id);
  if (!animal) {
    const err = new Error('Animal não encontrado.');
    err.status = 404;
    throw err;
  }
  return animal;
}

async function criarAnimal(body, arquivo) {
  const { nome, sexo, tipo, idade, porte, descricao } = body;
  const nomeAnimal = validarNomeAnimal(nome);
  const camposFaltando = [];
  if (!nomeAnimal)     camposFaltando.push('nome');
  if (!tipo)     camposFaltando.push('espécie');
  if (!idade)    camposFaltando.push('idade');
  if (!porte)    camposFaltando.push('porte');
  if (!descricao) camposFaltando.push('descrição');
  if (!body.historico) camposFaltando.push('histórico');
  if (!arquivo)  camposFaltando.push('foto');
  if (camposFaltando.length > 0) {
    const err = new Error(`Campos obrigatórios ausentes: ${camposFaltando.join(', ')}.`);
    err.status = 400;
    throw err;
  }
  const foto_url = arquivo ? await salvarFotoNoStorage(arquivo, nomeAnimal) : null;
  const vacinado = body.vacinado === '1' || body.vacinado === 'true' || body.vacinado === true;
  return animaisRepository.create({
    ...body,
    nome: nomeAnimal,
    vacinado,
    foto_url,
    tipo: (body.tipo || '').toUpperCase(),
    sexo: (body.sexo || '').toUpperCase(),
    cadastradoPor: body.cadastradoPor || null,
  });
}

async function atualizarAnimal(id, body, arquivo, adminId) {
  const atual = await animaisRepository.findById(id);
  if (!atual) {
    const err = new Error('Animal não encontrado.');
    err.status = 404;
    throw err;
  }
  if (atual.cadastradoPor && atual.cadastradoPor !== adminId) {
    const err = new Error('Você não tem permissão para editar este animal.');
    err.status = 403;
    throw err;
  }

  const nomeAnimal = body.nome !== undefined ? validarNomeAnimal(body.nome) : atual.nome;
  const foto_url = arquivo
    ? await salvarFotoNoStorage(arquivo, nomeAnimal)
    : (body.foto_url || atual.foto_url);
  const vacinado =
    body.vacinado !== undefined
      ? body.vacinado == '1' || body.vacinado === true
      : atual.vacinado;

  await animaisRepository.update(id, {
    nome: nomeAnimal,
    idade: body.idade || atual.idade,
    sexo: (body.sexo || atual.sexo).toUpperCase(),
    vacinado,
    status: (body.status || atual.status).toUpperCase(),
    tipo: (body.tipo || atual.tipo).toUpperCase(),
    descricao: body.descricao !== undefined ? body.descricao : atual.descricao,
    raca: body.raca !== undefined ? body.raca : atual.raca,
    porte: body.porte !== undefined ? body.porte : atual.porte,
    historico: body.historico !== undefined ? body.historico : atual.historico,
    foto_url,
  });
}

async function deletarAnimal(id, adminId) {
  const animal = await animaisRepository.findById(id);
  if (!animal) {
    const err = new Error('Animal não encontrado.');
    err.status = 404;
    throw err;
  }
  if (animal.cadastradoPor && animal.cadastradoPor !== adminId) {
    const err = new Error('Você não tem permissão para remover este animal.');
    err.status = 403;
    throw err;
  }
  const count = await animaisRepository.remove(id);
  if (!count) {
    const err = new Error('Animal não encontrado.');
    err.status = 404;
    throw err;
  }
}

module.exports = {
  listarAnimais,
  listarAnimaisAdmin,
  obterAnimalPorId,
  criarAnimal,
  atualizarAnimal,
  deletarAnimal,
};
