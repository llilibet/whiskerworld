const pool = require('../database/connection');

async function findByUsuario(usuarioId) {
  const [rows] = await pool.query(
    `SELECT f.id, f.usuario_id, f.animal_id,
            a.nome AS animal_nome, a.foto_url AS animal_foto
     FROM favoritos f
     LEFT JOIN animais a ON a.id = f.animal_id
     WHERE f.usuario_id = ?`,
    [usuarioId]
  );
  return rows;
}

async function create(usuarioId, animalId) {
  const [result] = await pool.query(
    'INSERT INTO favoritos (usuario_id, animal_id) VALUES (?, ?)',
    [usuarioId, animalId]
  );
  return { id: result.insertId };
}

async function remove(usuarioId, animalId) {
  const [result] = await pool.query(
    'DELETE FROM favoritos WHERE usuario_id = ? AND animal_id = ?',
    [usuarioId, animalId]
  );
  return result.affectedRows;
}

module.exports = { findByUsuario, create, remove };
