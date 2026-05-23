const pool = require('../database/connection');

async function findByUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT f.id, f.usuario_id, f.animal_id,
            a.nome AS animal_nome, a.foto_url AS animal_foto
     FROM favoritos f
     LEFT JOIN animais a ON a.id = f.animal_id
     WHERE f.usuario_id = $1`,
    [usuarioId]
  );
  return rows;
}

async function create(usuarioId, animalId) {
  const { rows } = await pool.query(
    'INSERT INTO favoritos (usuario_id, animal_id) VALUES ($1, $2) RETURNING id',
    [usuarioId, animalId]
  );
  return rows[0];
}

async function remove(usuarioId, animalId) {
  const { rowCount } = await pool.query(
    'DELETE FROM favoritos WHERE usuario_id = $1 AND animal_id = $2',
    [usuarioId, animalId]
  );
  return rowCount;
}

module.exports = { findByUsuario, create, remove };
