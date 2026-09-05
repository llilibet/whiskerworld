'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const AppError = require('../src/errors/AppError');

test('deve criar um erro controlado com mensagem e status HTTP', () => {
  const error = new AppError('Animal não encontrado.', 404);

  assert.equal(error instanceof Error, true);
  assert.equal(error instanceof AppError, true);
  assert.equal(error.name, 'AppError');
  assert.equal(error.message, 'Animal não encontrado.');
  assert.equal(error.status, 404);
});