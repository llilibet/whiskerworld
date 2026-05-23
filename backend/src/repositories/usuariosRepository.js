const pool = require('../database/connection');

async function findByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, tipo FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create({ nome, email, senhaHash, tipo }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, tipo)
     VALUES (?, ?, ?, ?)`,
    [nome, email, senhaHash, tipo]
  );
  return findById(result.insertId);
}

module.exports = { findByEmail, findById, create };
