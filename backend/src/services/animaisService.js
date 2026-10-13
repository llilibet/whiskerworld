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

async function criarAnimal(dadosNovoAnimal, arquivo) {
  const { nome, sexo, tipo, idade, porte, descricao } = dadosNovoAnimal;
  const nomeAnimal = validarNomeAnimal(nome);
  const camposFaltando = [];
  if (!nomeAnimal)     camposFaltando.push('nome');
  if (!tipo)     camposFaltando.push('espécie');
  if (!idade)    camposFaltando.push('idade');
  if (!porte)    camposFaltando.push('porte');
  if (!descricao) camposFaltando.push('descrição');
  if (!dadosNovoAnimal.historico) camposFaltando.push('histórico');
  if (!arquivo)  camposFaltando.push('foto');
  if (camposFaltando.length > 0) {
    throw new AppError(`Campos obrigatórios ausentes: ${camposFaltando.join(', ')}.`, 400);
  }
  const foto_url = arquivo ? await salvarFotoNoStorage(arquivo, nomeAnimal) : null;
  const vacinado = dadosNovoAnimal.vacinado === '1' || dadosNovoAnimal.vacinado === 'true' || dadosNovoAnimal.vacinado === true;
  return animaisRepository.create({
    ...dadosNovoAnimal,
    nome: nomeAnimal,
    vacinado,
    foto_url,
    tipo: (dadosNovoAnimal.tipo || '').toUpperCase(),
    sexo: (dadosNovoAnimal.sexo || '').toUpperCase(),
    cadastradoPor: dadosNovoAnimal.cadastradoPor || null,
  });
}

async function atualizarAnimal(id, dadosAtualizacao, arquivo, adminId) {
  const atual = await animaisRepository.findById(id);
  if (!atual) {
    throw new AppError('Animal não encontrado.', 404);
  }
  if (atual.cadastradoPor && atual.cadastradoPor !== adminId) {
    throw new AppError('Você não tem permissão para editar este animal.', 403);
  }

  const nomeAnimal = dadosAtualizacao.nome !== undefined ? validarNomeAnimal(dadosAtualizacao.nome) : atual.nome;
  const foto_url = arquivo
    ? await salvarFotoNoStorage(arquivo, nomeAnimal)
    : (dadosAtualizacao.foto_url || atual.foto_url);
  const vacinado =
    dadosAtualizacao.vacinado !== undefined
      ? dadosAtualizacao.vacinado == '1' || dadosAtualizacao.vacinado === true
      : atual.vacinado;

  await animaisRepository.update(id, {
    nome: nomeAnimal,
    idade: dadosAtualizacao.idade || atual.idade,
    sexo: (dadosAtualizacao.sexo || atual.sexo).toUpperCase(),
    vacinado,
    status: (dadosAtualizacao.status || atual.status).toUpperCase(),
    tipo: (dadosAtualizacao.tipo || atual.tipo).toUpperCase(),
    descricao: dadosAtualizacao.descricao !== undefined ? dadosAtualizacao.descricao : atual.descricao,
    raca: dadosAtualizacao.raca !== undefined ? dadosAtualizacao.raca : atual.raca,
    porte: dadosAtualizacao.porte !== undefined ? dadosAtualizacao.porte : atual.porte,
    historico: dadosAtualizacao.historico !== undefined ? dadosAtualizacao.historico : atual.historico,
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
  const quantidadeRemovida = await animaisRepository.remove(id);
  if (!quantidadeRemovida) {
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