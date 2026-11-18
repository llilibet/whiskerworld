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

// A partir do multer 2.5.0, o limite fileSize é inclusivo: uma foto de
// exatamente 2 MB é aceita, o mesmo limite usado pelo serviço. Até o multer
// 2.4.x, essa foto era recusada (o limite era atingido ao chegar em fileSize).
test('upload: aceita foto de até 2 MB', async () => {
  for (const tamanho of [2 * 1024 * 1024 - 1, 2 * 1024 * 1024]) {
    const resultado = await executar(requisicaoComFoto(tamanho));
    assert.equal(resultado.proximo, true, `foto de ${tamanho} bytes deveria ser aceita`);
    assert.equal(resultado.file.size, tamanho);
  }
});

test('upload: recusa foto maior que 2 MB', async () => {
  const resultado = await executar(requisicaoComFoto(2 * 1024 * 1024 + 1));
  // Compara só código e corpo: se o upload fosse aceito, o deepEqual tentaria
  // montar a diferença de um Buffer de 2 MB e o teste travaria.
  assert.equal(resultado.proximo, undefined, 'foto maior que 2 MB deveria ser recusada');
  assert.deepEqual(resultado, {
    codigo: 400,
    corpo: { mensagem: 'A fotografia deve ter no máximo 2 MB.' },
  });
});
