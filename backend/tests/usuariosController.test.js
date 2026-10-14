'use strict';

// Testes de caracterização de usuariosController.
// Criados antes da refatoração "Renomear Variável" (err -> erro) para registrar
// o tratamento de erros atual (handleError e blocos catch) e provar que ele não muda.

const test = require('node:test');
const assert = require('node:assert/strict');

const usuariosService = require('../src/services/usuariosService');
const usuariosController = require('../src/controllers/usuariosController');

function criarResposta() {
  return {
    statusCode: 200,
    corpo: undefined,
    status(codigo) { this.statusCode = codigo; return this; },
    json(corpo) { this.corpo = corpo; return this; },
  };
}

function silenciarConsoleError(t) {
  const registros = [];
  t.mock.method(console, 'error', (...args) => { registros.push(args); });
  return registros;
}

function erroComStatus(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

test('registrarUsuario responde 201 com a mensagem de sucesso e o resultado do serviço', async () => {
  usuariosService.registrarUsuario = async (dados) => ({ uid: 'u1', recebido: dados });
  const res = criarResposta();

  await usuariosController.registrarUsuario({ body: { email: 'a@b.com' } }, res);

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.corpo, {
    mensagem: 'Usuário cadastrado com sucesso.',
    uid: 'u1',
    recebido: { email: 'a@b.com' },
  });
});

test('registrarUsuario usa o status e a mensagem do erro e registra o erro no console', async (t) => {
  const registros = silenciarConsoleError(t);
  const erro = erroComStatus('E-mail já cadastrado.', 409);
  usuariosService.registrarUsuario = async () => { throw erro; };
  const res = criarResposta();

  await usuariosController.registrarUsuario({ body: {} }, res);

  assert.equal(res.statusCode, 409);
  assert.deepEqual(res.corpo, { mensagem: 'E-mail já cadastrado.' });
  assert.equal(registros.length, 1);
  assert.equal(registros[0][0], erro);
});

test('registrarUsuario responde 500 com mensagem padrão quando o erro não tem status nem mensagem', async (t) => {
  silenciarConsoleError(t);
  usuariosService.registrarUsuario = async () => { throw { }; };
  const res = criarResposta();

  await usuariosController.registrarUsuario({ body: {} }, res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.corpo, { mensagem: 'Erro interno.' });
});

test('syncGoogleUsuario envia o tipo em maiúsculas (ADOTANTE por padrão) e devolve o resultado', async () => {
  const chamadas = [];
  usuariosService.syncGoogleUsuario = async (dados) => { chamadas.push(dados); return { ok: true }; };

  const usuario = { id: 'u1', email: 'a@b.com', nome: 'Ana' };
  const res1 = criarResposta();
  await usuariosController.syncGoogleUsuario({ usuario, body: { tipo: 'admin' } }, res1);
  const res2 = criarResposta();
  await usuariosController.syncGoogleUsuario({ usuario, body: {} }, res2);

  assert.deepEqual(chamadas, [
    { uid: 'u1', email: 'a@b.com', nome: 'Ana', tipo: 'ADMIN' },
    { uid: 'u1', email: 'a@b.com', nome: 'Ana', tipo: 'ADOTANTE' },
  ]);
  assert.deepEqual(res1.corpo, { ok: true });
  assert.deepEqual(res2.corpo, { ok: true });
});

test('syncGoogleUsuario trata o erro do serviço com o status do erro', async (t) => {
  silenciarConsoleError(t);
  usuariosService.syncGoogleUsuario = async () => { throw erroComStatus('Falha ao sincronizar.', 502); };
  const res = criarResposta();

  await usuariosController.syncGoogleUsuario(
    { usuario: { id: 'u1', email: 'a@b.com', nome: 'Ana' }, body: {} },
    res
  );

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.corpo, { mensagem: 'Falha ao sincronizar.' });
});

test('retornaUsuarioLogado responde 401 sem usuário e devolve os dados públicos com usuário', async () => {
  const semUsuario = criarResposta();
  await usuariosController.retornaUsuarioLogado({}, semUsuario);
  assert.equal(semUsuario.statusCode, 401);
  assert.deepEqual(semUsuario.corpo, { mensagem: 'Não autenticado.' });

  const comUsuario = criarResposta();
  await usuariosController.retornaUsuarioLogado(
    { usuario: { id: 'u1', nome: 'Ana', email: 'a@b.com', tipo: 'ADOTANTE', senha: 'segredo' } },
    comUsuario
  );
  assert.deepEqual(comUsuario.corpo, { id: 'u1', nome: 'Ana', email: 'a@b.com', tipo: 'ADOTANTE' });
});

test('excluirUsuario responde com a mensagem de sucesso e, em caso de erro, com o status do erro', async (t) => {
  silenciarConsoleError(t);
  let idExcluido;
  usuariosService.excluirUsuario = async (id) => { idExcluido = id; };
  const ok = criarResposta();
  await usuariosController.excluirUsuario({ usuario: { id: 'u1' } }, ok);
  assert.equal(idExcluido, 'u1');
  assert.deepEqual(ok.corpo, { mensagem: 'Conta excluída com sucesso.' });

  usuariosService.excluirUsuario = async () => { throw erroComStatus('Usuário não encontrado.', 404); };
  const falha = criarResposta();
  await usuariosController.excluirUsuario({ usuario: { id: 'u1' } }, falha);
  assert.equal(falha.statusCode, 404);
  assert.deepEqual(falha.corpo, { mensagem: 'Usuário não encontrado.' });
});
