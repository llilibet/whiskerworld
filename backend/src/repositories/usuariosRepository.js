const pool = require('../database/connection');

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, nome, email, tipo FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function create({ nome, email, senhaHash, tipo }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, tipo)
     VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo`,
    [nome, email, senhaHash, tipo]
  );
  return rows[0];
}

module.exports = { findByEmail, findById, create };
