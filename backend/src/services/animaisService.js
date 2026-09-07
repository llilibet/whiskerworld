const animaisRepository = require('../repositories/animaisRepository');
const { salvarFotoNoStorage } = require('../database/connection');
const AppError = require('../errors/AppError');

function validarNomeAnimal(nome) {
  const nomeNormalizado = String(nome || '').trim();

  if (!nomeNormalizado) {
    throw new AppError('O nome do animal é obrigatório.', 400);
  }

  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/u.test(nomeNormalizado)) {
    throw new AppError('O nome do animal deve conter apenas letras e espaços.', 400);
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
    throw new AppError('Animal não encontrado.', 404);
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
    throw new AppError(`Campos obrigatórios ausentes: ${camposFaltando.join(', ')}.`, 400);
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
    throw new AppError('Animal não encontrado.', 404);
  }
  if (atual.cadastradoPor && atual.cadastradoPor !== adminId) {
    throw new AppError('Você não tem permissão para editar este animal.', 403);
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
    throw new AppError('Animal não encontrado.', 404);
  }
  if (animal.cadastradoPor && animal.cadastradoPor !== adminId) {
    throw new AppError('Você não tem permissão para remover este animal.', 403);
  }
  const count = await animaisRepository.remove(id);
  if (!count) {
    throw new AppError('Animal não encontrado.', 404);
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
