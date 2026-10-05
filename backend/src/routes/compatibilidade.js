const express = require('express');
const {
  avaliarCompatibilidade,
} = require('../controllers/compatibilidadeController');
const {
  autenticarToken,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/:animalId',
  autenticarToken,
  avaliarCompatibilidade
);

module.exports = router;