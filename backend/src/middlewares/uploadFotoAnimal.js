const multer = require('multer');

const uploadFotoAnimal = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('O arquivo precisa ser uma imagem.'));
    }
    cb(null, true);
  },
});

module.exports = uploadFotoAnimal;

