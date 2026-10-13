'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { bucket } = require('../src/database/connection');
const fotosAcompanhamentoService = require('../src/services/fotosAcompanhamentoService');

const assinaturaPng = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function png(tamanho) {
  const buffer = Buffer.alloc(tamanho);
  assinaturaPng.copy(buffer);
  return buffer;
}

function prepararBucket() {
  const chamadas = [];
  bucket.file = (caminho) => ({
    save: async (_buffer, opcoes) => chamadas.push({ caminho, opcoes }),
    getSignedUrl: async (opcoes) => {
      chamadas.push({ caminho, opcoes });
      return ['https://exemplo/url-assinada'];
    },
  });
  return chamadas;
}

async function assertFotoRecusada(file, mensagem) {
  await assert.rejects(fotosAcompanhamentoService.salvarFoto(file), (err) => {
    assert.equal(err.status, 400);
    assert.equal(err.message, mensagem);
    return true;
  });
}

test('foto: aceita PNG de exatamente 2 MB e recusa vazia ou acima de 2 MB', async () => {
  prepararBucket();

  const salva = await fotosAcompanhamentoService.salvarFoto({
    buffer: png(2 * 1024 * 1024),
    mimetype: 'image/png',
  });
  assert.equal(salva.foto_tipo, 'image/png');
  assert.match(salva.foto_caminho, /^acompanhamentos\/.+\.png$/);

  const mensagem = 'A fotografia deve conter dados e ter no máximo 2 MB.';
  await assertFotoRecusada({ buffer: Buffer.alloc(0), mimetype: 'image/png' }, mensagem);
  await assertFotoRecusada(
    { buffer: png(2 * 1024 * 1024 + 1), mimetype: 'image/png' },
    mensagem
  );
});

test('foto: exige assinatura PNG compatível com o tipo declarado', async () => {
  prepararBucket();
  const mensagem = 'O conteúdo da fotografia não corresponde a um formato permitido.';

  await assertFotoRecusada(
    { buffer: Buffer.alloc(16), mimetype: 'image/png' },
    mensagem
  );
  await assertFotoRecusada({ buffer: png(16), mimetype: 'image/jpeg' }, mensagem);
});

test('foto: URL temporária expira 15 minutos após a geração', async (t) => {
  const chamadas = prepararBucket();
  t.mock.method(Date, 'now', () => 1_000_000);

  const url = await fotosAcompanhamentoService.obterUrlTemporaria('acompanhamentos/x.png');

  assert.equal(url, 'https://exemplo/url-assinada');
  assert.deepEqual(chamadas.at(-1).opcoes, {
    version: 'v4',
    action: 'read',
    expires: 1_000_000 + 15 * 60 * 1000,
  });
});
