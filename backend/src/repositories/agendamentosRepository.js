const pool = require('../database/connection');

async function findByUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT a.id, a.data_visita, a.hora_visita, a.status, a.observacoes,
            an.nome AS nome_animal, an.tipo AS tipo_animal
     FROM agendamentos a
     JOIN animais an ON an.id = a.animal_id
     WHERE a.usuario_id = $1
     ORDER BY a.data_visita, a.hora_visita`,
    [usuarioId]
  );
  return rows;
}

async function findAll() {
  const { rows } = await pool.query(`
    SELECT a.id, a.data_visita, a.hora_visita, a.status, a.observacoes,
           u.nome AS nome_usuario, u.email AS email_usuario,
           an.id AS animal_id, an.nome AS nome_animal, an.tipo AS tipo_animal
    FROM agendamentos a
    JOIN usuarios u ON u.id = a.usuario_id
    JOIN animais an ON an.id = a.animal_id
    ORDER BY a.data_visita, a.hora_visita
  `);
  return rows;
}

async function findActiveByUsuarioAndAnimal(usuarioId, animalId) {
  const { rows } = await pool.query(
    `SELECT id FROM agendamentos
     WHERE usuario_id = $1 AND animal_id = $2 AND status IN ('PENDENTE', 'CONFIRMADO')`,
    [usuarioId, animalId]
  );
  return rows;
}

async function create({ usuarioId, animalId, dataVisita, horaVisita, observacoes }) {
  const { rows } = await pool.query(
    `INSERT INTO agendamentos (usuario_id, animal_id, data_visita, hora_visita, status, observacoes)
     VALUES ($1, $2, $3, $4, 'PENDENTE', $5) RETURNING *`,
    [usuarioId, animalId, dataVisita, horaVisita, observacoes || null]
  );
  return rows[0];
}

async function updateStatus(id, status) {
  const { rowCount } = await pool.query(
    'UPDATE agendamentos SET status = $1 WHERE id = $2',
    [status.toUpperCase(), id]
  );
  return rowCount;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM agendamentos WHERE id = $1', [id]);
  return rowCount;
}

module.exports = { findByUsuario, findAll, findActiveByUsuarioAndAnimal, create, updateStatus, remove };
