const pool = require("../database/connection");

// cria o gendamento para o usuário logado
async function criarAgendamento(req, res) {
  const { animal_id, data_visita, hora_visita, observacoes } = req.body;
  const usuarioId = req.usuario.id; // vem do token

  try {
    if (!animal_id || !data_visita || !hora_visita) {
      return res.status(400).json({
        mensagem:
          "animal_id, data_visita (YYYY-MM-DD) e hora_visita (HH:MM) são obrigatórios.",
      });
    }

    // verifica se animal existe
    const [animalRows] = await pool.query(
      "SELECT id, nome FROM animais WHERE id = ?",
      [animal_id]
    );
    if (animalRows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    // insere agendamento
    const [resultado] = await pool.query(
      `INSERT INTO agendamentos 
       (usuario_id, animal_id, data_visita, hora_visita, status, observacoes)
       VALUES (?, ?, ?, ?, 'PENDENTE', ?)`,
      [usuarioId, animal_id, data_visita, hora_visita, observacoes || null]
    );

    return res.status(201).json({
      mensagem: "Agendamento criado com sucesso.",
      agendamento: {
        id: resultado.insertId,
        usuario_id: usuarioId,
        animal_id,
        data_visita,
        hora_visita,
        status: "PENDENTE",
        observacoes: observacoes || null,
      },
    });
  } catch (erro) {
    console.error("Erro ao criar agendamento:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao criar agendamento." });
  }
}

 // lista os agendamentos do usuário logado
async function listarMeusAgendamentos(req, res) {
  const usuarioId = req.usuario.id;

  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.data_visita, a.hora_visita, a.status, a.observacoes,
              an.nome AS nome_animal, an.tipo AS tipo_animal
       FROM agendamentos a
       JOIN animais an ON an.id = a.animal_id
       WHERE a.usuario_id = ?
       ORDER BY a.data_visita, a.hora_visita`,
      [usuarioId]
    );

    return res.json(rows);
  } catch (erro) {
    console.error("Erro ao listar agendamentos do usuário:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao listar seus agendamentos." });
  }
}

 // lista todos os agendamentos (apenas ADMIN)
async function listarTodosAgendamentos(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.data_visita, a.hora_visita, a.status, a.observacoes,
              u.nome AS nome_usuario, u.email AS email_usuario,
              an.nome AS nome_animal, an.tipo AS tipo_animal
       FROM agendamentos a
       JOIN usuarios u ON u.id = a.usuario_id
       JOIN animais an ON an.id = a.animal_id
       ORDER BY a.data_visita, a.hora_visita`
    );

    return res.json(rows);
  } catch (erro) {
    console.error("Erro ao listar todos agendamentos:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao listar agendamentos." });
  }
}
// atualiza o status (PENDENTE / CONFIRMADO / CANCELADO) – apenas ADMIN
async function atualizarStatusAgendamento(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res
        .status(400)
        .json({ mensagem: "Status é obrigatório (PENDENTE, CONFIRMADO, CANCELADO)." });
    }

    const statusUpper = status.toUpperCase();

    const [resultado] = await pool.query(
      "UPDATE agendamentos SET status = ? WHERE id = ?",
      [statusUpper, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Agendamento não encontrado." });
    }

    return res.json({ mensagem: "Status do agendamento atualizado com sucesso." });
  } catch (erro) {
    console.error("Erro ao atualizar status do agendamento:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao atualizar status." });
  }
}

/**
 * DELETE /agendamentos/:id
 * Usuário pode cancelar o próprio agendamento.
 * Admin pode cancelar qualquer um.
 */
async function deletarAgendamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuario.id;
  const tipoUsuario = req.usuario.tipo;

  try {
    // busca agendamento
    const [rows] = await pool.query(
      "SELECT usuario_id FROM agendamentos WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Agendamento não encontrado." });
    }

    const agendamento = rows[0];

    // se não for admin e não for dono do agendamento, bloqueia
    if (tipoUsuario !== "ADMIN" && agendamento.usuario_id !== usuarioId) {
      return res.status(403).json({
        mensagem: "Você não tem permissão para cancelar este agendamento.",
      });
    }

    await pool.query("DELETE FROM agendamentos WHERE id = ?", [id]);

    return res.json({ mensagem: "Agendamento cancelado/removido com sucesso." });
  } catch (erro) {
    console.error("Erro ao deletar agendamento:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao remover agendamento." });
  }
}

module.exports = {
  criarAgendamento,
  listarMeusAgendamentos,
  listarTodosAgendamentos,
  atualizarStatusAgendamento,
  deletarAgendamento,
};
