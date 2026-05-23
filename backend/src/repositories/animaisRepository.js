const pool = require('../database/connection');

async function findAll(tipo = null) {
  let query = "SELECT * FROM animais WHERE status = 'DISPONIVEL'";
  const params = [];
  if (tipo) {
    params.push(tipo.toUpperCase());
    query += ' AND tipo = ?';
  }
  query += ' ORDER BY id DESC';
  const [rows] = await pool.query(query, params);
  return rows;
}

async function findAllAdmin() {
  const [rows] = await pool.query('SELECT * FROM animais ORDER BY id DESC');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM animais WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ nome, idade, sexo, vacinado, status, tipo, raca, porte, descricao, historico, foto_url }) {
  const [result] = await pool.query(
    `INSERT INTO animais (nome, idade, sexo, vacinado, status, tipo, raca, porte, descricao, historico, foto_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome,
      idade || null,
      sexo,
      vacinado,
      status || 'DISPONIVEL',
      tipo,
      raca || null,
      porte || null,
      descricao || null,
      historico || null,
      foto_url,
    ]
  );
  return findById(result.insertId);
}

async function update(id, { nome, idade, sexo, vacinado, status, tipo, raca, porte, descricao, historico, foto_url }) {
  await pool.query(
    `UPDATE animais
     SET nome=?, idade=?, sexo=?, vacinado=?, status=?, tipo=?, raca=?, porte=?, descricao=?, historico=?, foto_url=?
     WHERE id=?`,
    [nome, idade, sexo, vacinado, status, tipo, raca, porte, descricao, historico, foto_url, id]
  );
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM animais WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { findAll, findAllAdmin, findById, create, update, remove };
