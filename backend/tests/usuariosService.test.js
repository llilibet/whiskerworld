'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const admin = require('firebase-admin');
const { db } = require('../src/database/connection');
const usuariosRepository = require('../src/repositories/usuariosRepository');
const usuariosService = require('../src/services/usuariosService');

const auth = admin.auth();

function erroFirebase(code) {
  const err = new Error(code);
  err.code = code;
  return err;
}

// Substitui Firebase Auth, Firestore e repositório por dublês em memória
// e devolve o registro das chamadas feitas pelo serviço.
function prepararAmbiente({
  emailNoFirestore = null,
  erroGetUserByEmail = erroFirebase('auth/user-not-found'),
  erroCreateUser = null,
  documentoExistente = null,
} = {}) {
  const chamadas = { claims: [], documentos: [], usuariosCriados: [] };

  usuariosRepository.findByEmail = async () => emailNoFirestore;

  auth.getUserByEmail = async () => {
    if (erroGetUserByEmail) throw erroGetUserByEmail;
    return { uid: 'existente' };
  };
  auth.createUser = async (dados) => {
    if (erroCreateUser) throw erroCreateUser;
    chamadas.usuariosCriados.push(dados);
    return { uid: 'uid-123' };
  };
  auth.setCustomUserClaims = async (uid, claims) => {
    chamadas.claims.push({ uid, claims });
  };
  auth.createCustomToken = async (uid) => `token-${uid}`;

  db.collection = (colecao) => ({
    doc: (id) => ({
      set: async (dados) => {
        chamadas.documentos.push({ colecao, id, dados });
      },
      get: async () => ({
        exists: documentoExistente !== null,
        data: () => documentoExistente,
      }),
    }),
  });

  return chamadas;
}

const cadastroValido = {
  nome: '  Maria Souza  ',
  email: '  Maria@Email.COM ',
  senha: '123456',
  aceitouTermos: true,
  aceitouPrivacidade: true,
};

async function assertErro(promessa, status, mensagem) {
  await assert.rejects(promessa, (err) => {
    assert.equal(err.status, status);
    assert.equal(err.message, mensagem);
    return true;
  });
}

test('registrarUsuario: exige nome, email e senha', async () => {
  prepararAmbiente();
  for (const campo of ['nome', 'email', 'senha']) {
    await assertErro(
      usuariosService.registrarUsuario({ ...cadastroValido, [campo]: '' }),
      400,
      'Nome, email e senha são obrigatórios.'
    );
  }
});

test('registrarUsuario: exige aceite dos termos e da política de privacidade', async () => {
  prepararAmbiente();
  for (const alteracao of [{ aceitouTermos: false }, { aceitouPrivacidade: 'true' }]) {
    await assertErro(
      usuariosService.registrarUsuario({ ...cadastroValido, ...alteracao }),
      400,
      'É necessário aceitar os Termos de Uso e a Política de Privacidade.'
    );
  }
});

test('registrarUsuario: valida formato do e-mail e tamanho da senha', async () => {
  prepararAmbiente();
  await assertErro(
    usuariosService.registrarUsuario({ ...cadastroValido, email: 'maria@email' }),
    400,
    'Formato de e-mail inválido.'
  );
  await assertErro(
    usuariosService.registrarUsuario({ ...cadastroValido, senha: '12345' }),
    400,
    'A senha deve ter pelo menos 6 caracteres.'
  );
});

test('registrarUsuario: recusa e-mail já cadastrado no Firestore ou no Firebase Auth', async () => {
  prepararAmbiente({ emailNoFirestore: { id: 'x' } });
  await assertErro(usuariosService.registrarUsuario(cadastroValido), 409, 'E-mail já cadastrado.');

  prepararAmbiente({ erroGetUserByEmail: null });
  await assertErro(usuariosService.registrarUsuario(cadastroValido), 409, 'E-mail já cadastrado.');
});

test('registrarUsuario: propaga erro inesperado ao consultar o Firebase Auth', async () => {
  const erro = erroFirebase('auth/internal-error');
  prepararAmbiente({ erroGetUserByEmail: erro });
  await assert.rejects(usuariosService.registrarUsuario(cadastroValido), (err) => err === erro);
});

test('registrarUsuario: cria conta, claims, documento com consentimento e token', async () => {
  const chamadas = prepararAmbiente();

  const resultado = await usuariosService.registrarUsuario(cadastroValido);

  assert.deepEqual(resultado, {
    usuario: { id: 'uid-123', nome: 'Maria Souza', email: 'maria@email.com', tipo: 'ADOTANTE' },
    customToken: 'token-uid-123',
  });
  assert.deepEqual(chamadas.usuariosCriados, [
    { email: 'maria@email.com', password: '123456', displayName: 'Maria Souza' },
  ]);
  assert.deepEqual(chamadas.claims, [
    { uid: 'uid-123', claims: { tipo: 'ADOTANTE', nome: 'Maria Souza' } },
  ]);

  assert.equal(chamadas.documentos.length, 1);
  const { colecao, id, dados } = chamadas.documentos[0];
  assert.equal(colecao, 'usuarios');
  assert.equal(id, 'uid-123');
  assert.ok(!Number.isNaN(Date.parse(dados.termosAceitosEm)));
  assert.deepEqual(dados, {
    nome: 'Maria Souza',
    email: 'maria@email.com',
    tipo: 'ADOTANTE',
    termosAceitos: true,
    termosAceitosEm: dados.termosAceitosEm,
    versaoTermos: '1.0',
    privacidadeAceita: true,
    privacidadeAceitaEm: dados.termosAceitosEm,
    versaoPrivacidade: '1.0',
  });
});

test('registrarUsuario: converte o tipo informado para maiúsculas', async () => {
  prepararAmbiente();
  const resultado = await usuariosService.registrarUsuario({ ...cadastroValido, tipo: 'admin' });
  assert.equal(resultado.usuario.tipo, 'ADMIN');
});

test('registrarUsuario: traduz erros do Firebase Auth ao criar a conta', async () => {
  const casos = [
    ['auth/email-already-exists', 409, 'E-mail já cadastrado.'],
    ['auth/invalid-email', 400, 'Formato de e-mail inválido.'],
    ['auth/weak-password', 400, 'Senha fraca. Use pelo menos 6 caracteres.'],
    ['auth/invalid-password', 400, 'Senha fraca. Use pelo menos 6 caracteres.'],
  ];

  for (const [code, status, mensagem] of casos) {
    prepararAmbiente({ erroCreateUser: erroFirebase(code) });
    await assertErro(usuariosService.registrarUsuario(cadastroValido), status, mensagem);
  }

  const desconhecido = erroFirebase('auth/quota-exceeded');
  prepararAmbiente({ erroCreateUser: desconhecido });
  await assert.rejects(usuariosService.registrarUsuario(cadastroValido), (err) => err === desconhecido);
});

test('syncGoogleUsuario: cria documento e claims para usuário novo', async () => {
  const chamadas = prepararAmbiente();

  const resultado = await usuariosService.syncGoogleUsuario({
    uid: 'g-1', email: 'ana@gmail.com', nome: 'Ana', tipo: 'admin',
  });

  assert.deepEqual(resultado, { tipo: 'ADMIN', nome: 'Ana', isNew: true });
  assert.deepEqual(chamadas.documentos, [
    { colecao: 'usuarios', id: 'g-1', dados: { nome: 'Ana', email: 'ana@gmail.com', tipo: 'ADMIN' } },
  ]);
  assert.deepEqual(chamadas.claims, [{ uid: 'g-1', claims: { tipo: 'ADMIN', nome: 'Ana' } }]);
});

test('syncGoogleUsuario: usa ADOTANTE quando nenhum tipo é informado', async () => {
  prepararAmbiente();
  const resultado = await usuariosService.syncGoogleUsuario({ uid: 'g-2', email: 'b@b.com', nome: 'Bia' });
  assert.equal(resultado.tipo, 'ADOTANTE');
});

test('syncGoogleUsuario: respeita o tipo de um usuário já existente', async () => {
  const chamadas = prepararAmbiente({ documentoExistente: { tipo: 'ADMIN' } });
  const resultado = await usuariosService.syncGoogleUsuario({
    uid: 'g-3', email: 'c@c.com', nome: 'Caio', tipo: 'ADOTANTE',
  });
  assert.deepEqual(resultado, { tipo: 'ADMIN', nome: 'Caio', isNew: false });
  assert.deepEqual(chamadas.documentos, []);
  assert.deepEqual(chamadas.claims, []);

  prepararAmbiente({ documentoExistente: {} });
  const semTipo = await usuariosService.syncGoogleUsuario({ uid: 'g-4', email: 'd@d.com', nome: 'Duda' });
  assert.equal(semTipo.tipo, 'ADOTANTE');
});
