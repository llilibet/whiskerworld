'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const appSource = fs.readFileSync(require('node:path').join(__dirname, '../../client/src/App.jsx'), 'utf8');
const loginSource = fs.readFileSync(require('node:path').join(__dirname, '../../client/src/pages/LoginPage.jsx'), 'utf8');
const cadastroSource = fs.readFileSync(require('node:path').join(__dirname, '../../client/src/pages/CadastroPage.jsx'), 'utf8');

test('deve remover a rota pública de cadastro para administradores', () => {
  assert.ok(!appSource.includes('path="/cadastro/:tipo"'), 'A rota pública de cadastro não deve existir para nenhum perfil.');
});

test('deve ocultar o link de cadastro na tela de login do administrador', () => {
  assert.ok(loginSource.includes('!isAdmin'), 'A renderização do link deve estar condicionada ao tipo de usuário.');
  assert.ok(loginSource.includes('Ainda não tem uma conta?'), 'O texto de cadastro deve existir apenas para usuários não administrativos.');
});

test('deve bloquear acesso manual à tela de cadastro do administrador', () => {
  assert.ok(cadastroSource.includes('isAdmin') && cadastroSource.includes('Navigate'), 'A tela de cadastro do administrador deve redirecionar para login.');
});
