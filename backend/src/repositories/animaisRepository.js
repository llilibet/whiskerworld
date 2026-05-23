const pool = require('../database/connection');

async function findAll(tipo = null) {
  let query = "SELECT * FROM animais WHERE status = 'DISPONIVEL'";
  const params = [];
  if (tipo) {
    params.push(tipo.toUpperCase());
    query += ` AND tipo = $${params.length}`;
  }
  query += ' ORDER BY id DESC';
  const { rows } = await pool.query(query, params);
  return rows;
}

async function findAllAdmin() {
  const { rows } = await pool.query('SELECT * FROM animais ORDER BY id DESC');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM animais WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ nome, idade, sexo, vacinado, status, tipo, descricao, foto_url }) {
  const { rows } = await pool.query(
    `INSERT INTO animais (nome, idade, sexo, vacinado, status, tipo, descricao, foto_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [nome, idade || null, sexo, vacinado, status || 'DISPONIVEL', tipo, descricao || null, foto_url]
  );
  return rows[0];
}

async function update(id, { nome, idade, sexo, vacinado, status, tipo, descricao, foto_url }) {
  await pool.query(
    `UPDATE animais
     SET nome=$1, idade=$2, sexo=$3, vacinado=$4, status=$5, tipo=$6, descricao=$7, foto_url=$8
     WHERE id=$9`,
    [nome, idade, sexo, vacinado, status, tipo, descricao, foto_url, id]
  );
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM animais WHERE id = $1', [id]);
  return rowCount;
}

module.exports = { findAll, findAllAdmin, findById, create, update, remove };
