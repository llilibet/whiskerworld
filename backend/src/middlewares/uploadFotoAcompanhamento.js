const multer = require('multer');

const formatosPermitidos = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
    fields: 2,
    fieldSize: 64 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!formatosPermitidos.has(file.mimetype)) {
      return callback(
        new Error('A fotografia deve estar no formato JPEG, PNG ou WebP.')
      );
    }

    callback(null, true);
  },
});

function uploadFotoAcompanhamento(req, res, next) {
  upload.single('foto')(req, res, (erro) => {
    if (!erro) {
      return next();
    }

    let mensagem = 'Não foi possível receber a fotografia.';

    if (erro.code === 'LIMIT_FILE_SIZE') {
      mensagem = 'A fotografia deve ter no máximo 2 MB.';
    } else if (erro.code === 'LIMIT_UNEXPECTED_FILE') {
      mensagem = 'Envie apenas uma fotografia no campo foto.';
    } else if (erro instanceof multer.MulterError) {
      mensagem = 'O formulário excedeu os limites permitidos.';
    } else {
      mensagem = erro.message;
    }

    return res.status(400).json({ mensagem });
  });
}

module.exports = uploadFotoAcompanhamento;