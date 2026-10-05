const { randomUUID } = require('crypto');
const { bucket } = require('../database/connection');
const AppError = require('../errors/AppError');

function validarFoto(file) {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    throw new AppError('Fotografia inválida.', 400);
  }

  const buffer = file.buffer;

  if (!buffer.length || buffer.length > 2 * 1024 * 1024) {
    throw new AppError(
      'A fotografia deve conter dados e ter no máximo 2 MB.',
      400
    );
  }

  const jpeg =
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const png =
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    );

  const webp =
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP';

  if (jpeg && file.mimetype === 'image/jpeg') {
    return { extensao: 'jpg', tipo: 'image/jpeg' };
  }

  if (png && file.mimetype === 'image/png') {
    return { extensao: 'png', tipo: 'image/png' };
  }

  if (webp && file.mimetype === 'image/webp') {
    return { extensao: 'webp', tipo: 'image/webp' };
  }

  throw new AppError(
    'O conteúdo da fotografia não corresponde a um formato permitido.',
    400
  );
}

async function salvarFoto(file) {
  const { extensao, tipo } = validarFoto(file);

  const caminho = `acompanhamentos/${randomUUID()}.${extensao}`;
  const arquivo = bucket.file(caminho);

  await arquivo.save(file.buffer, {
    resumable: false,
    metadata: {
      contentType: tipo,
      cacheControl: 'private, no-store',
    },
  });

  return {
    foto_caminho: caminho,
    foto_tipo: tipo,
  };
}

async function excluirFoto(caminho) {
  await bucket.file(caminho).delete({
    ignoreNotFound: true,
  });
}

async function obterUrlTemporaria(caminho) {
  const [url] = await bucket.file(caminho).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000,
  });

  return url;
}

module.exports = {
  salvarFoto,
  excluirFoto,
  obterUrlTemporaria,
};