'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('stream');

const uploadFotoAcompanhamento = require('../src/middlewares/uploadFotoAcompanhamento');

const fronteira = '----whiskerworld';

function requisicaoComFoto(tamanho) {
  const corpo = Buffer.concat([
    Buffer.from(
      `--${fronteira}\r\n` +
      'Content-Disposition: form-data; name="foto"; filename="foto.png"\r\n' +
      'Content-Type: image/png\r\n\r\n'
    ),
    Buffer.alloc(tamanho),
    Buffer.from(`\r\n--${fronteira}--\r\n`),
  ]);

  const req = Readable.from([corpo]);
  req.headers = {
    'content-type': `multipart/form-data; boundary=${fronteira}`,
    'content-length': String(corpo.length),
  };
  return req;
}

function executar(req) {
  return new Promise((resolve) => {
    const res = {
      status(codigo) {
        return { json: (corpo) => resolve({ codigo, corpo }) };
      },
    };
    uploadFotoAcompanhamento(req, res, () => resolve({ proximo: true, file: req.file }));
  });
}

test('upload: aceita foto com 1 byte a menos que 2 MB', async () => {
  const resultado = await executar(requisicaoComFoto(2 * 1024 * 1024 - 1));
  assert.equal(resultado.proximo, true);
  assert.equal(resultado.file.size, 2 * 1024 * 1024 - 1);
});

// O multer considera o limite atingido ao chegar em fileSize, então uma foto
// de exatamente 2 MB é recusada aqui (o serviço aceitaria esse tamanho).
test('upload: recusa foto a partir de 2 MB', async () => {
  for (const tamanho of [2 * 1024 * 1024, 2 * 1024 * 1024 + 1]) {
    const resultado = await executar(requisicaoComFoto(tamanho));
    assert.deepEqual(resultado, {
      codigo: 400,
      corpo: { mensagem: 'A fotografia deve ter no máximo 2 MB.' },
    });
  }
});
