const multer = require("multer");
const path = require("path");
const fs = require("fs");

// pasta uploads/animais na raiz do backend
const uploadDir = path.join(__dirname, "..", "..", "uploads", "animais");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png...
    const nomeBruto = (req.body.nome || "animal").toLowerCase();
    const nomeSeguro = nomeBruto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nomeSlug = nomeSeguro.replace(/[^a-z0-9]+/g, "-");
    const timestamp = Date.now();
    cb(null, `${nomeSlug}-${timestamp}${ext}`);
  },
});

const uploadFotoAnimal = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("O arquivo precisa ser uma imagem."));
    }
    cb(null, true);
  },
});

module.exports = uploadFotoAnimal;
