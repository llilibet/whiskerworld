const animaisRepository = require('../repositories/animaisRepository');

async function listarAnimais(tipo) {
  return animaisRepository.findAll(tipo);
}

async function listarAnimaisAdmin() {
  return animaisRepository.findAllAdmin();
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
  const { nome, sexo, tipo } = body;
  if (!nome || !sexo || !tipo) {
    const err = new Error('Nome, sexo e tipo são obrigatórios.');
    err.status = 400;
    throw err;
  }
  const foto_url = arquivo ? `/uploads/animais/${arquivo.filename}` : null;
  const vacinado = body.vacinado === '1' || body.vacinado === 'true' || body.vacinado === true;
  return animaisRepository.create({
    ...body,
    sexo: body.sexo.toUpperCase(),
    tipo: body.tipo.toUpperCase(),
    status: (body.status || 'DISPONIVEL').toUpperCase(),
    porte: body.porte ? body.porte.toUpperCase() : null,
    vacinado,
    foto_url,
  });
}

async function atualizarAnimal(id, body, arquivo) {
  const atual = await animaisRepository.findById(id);
  if (!atual) {
    const err = new Error('Animal não encontrado.');
    err.status = 404;
    throw err;
  }
  const foto_url = arquivo
    ? `/uploads/animais/${arquivo.filename}`
    : (body.foto_url || atual.foto_url);
  const vacinado =
    body.vacinado !== undefined
      ? body.vacinado == '1' || body.vacinado === true
      : atual.vacinado;

  await animaisRepository.update(id, {
    nome: body.nome || atual.nome,
    idade: body.idade || atual.idade,
    sexo: (body.sexo || atual.sexo).toUpperCase(),
    vacinado,
    status: (body.status || atual.status).toUpperCase(),
    tipo: (body.tipo || atual.tipo).toUpperCase(),
    raca: body.raca !== undefined ? body.raca : atual.raca,
    porte: body.porte !== undefined ? body.porte.toUpperCase() : atual.porte,
    descricao: body.descricao !== undefined ? body.descricao : atual.descricao,
    historico: body.historico !== undefined ? body.historico : atual.historico,
    foto_url,
  });
}

async function deletarAnimal(id) {
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
