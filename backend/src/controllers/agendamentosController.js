const pool = require("../database/connection");

// cria agendamento
async function criarAgendamento(req, res) {
  const { animal_id, data_visita, hora_visita, observacoes } = req.body;
  const usuarioId = req.usuario?.id;

  try {
    if (!usuarioId) {
      return res.status(401).json({ mensagem: "Usuário não autenticado." });
    }

    if (!animal_id || !data_visita || !hora_visita) {
      return res.status(400).json({
        mensagem: "animal_id, data_visita e hora_visita são obrigatórios.",
      });
    }

    // verifica animal
    const { rows: animalRows } = await pool.query(
      "SELECT id, nome FROM animais WHERE id = $1",
      [animal_id]
    );

    if (animalRows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    // verifica duplicidade
    const { rows: existe } = await pool.query(
      `SELECT id FROM agendamentos
       WHERE usuario_id = $1 AND animal_id = $2
       AND status IN ('PENDENTE', 'CONFIRMADO')`,
      [usuarioId, animal_id]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        mensagem: "Você já possui um agendamento ativo para este animal.",
      });
    }

    // insert
    const { rows } = await pool.query(
      `INSERT INTO agendamentos
       (usuario_id, animal_id, data_visita, hora_visita, status, observacoes)
       VALUES ($1, $2, $3, $4, 'PENDENTE', $5)
       RETURNING *`,
      [usuarioId, animal_id, data_visita, hora_visita, observacoes || null]
    );

    return res.status(201).json({
      mensagem: "Agendamento criado com sucesso.",
      agendamento: rows[0],
    });

  } catch (erro) {
    console.error("Erro ao criar agendamento:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao criar agendamento." });
  }
}

// listar meus agendamentos
async function listarMeusAgendamentos(req, res) {
  const usuarioId = req.usuario?.id;

  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.data_visita, a.hora_visita, a.status, a.observacoes,
              an.nome AS nome_animal, an.tipo AS tipo_animal
       FROM agendamentos a
       JOIN animais an ON an.id = a.animal_id
       WHERE a.usuario_id = $1
       ORDER BY a.data_visita, a.hora_visita`,
      [usuarioId]
    );

    return res.json(rows);

  } catch (erro) {
    console.error("Erro ao listar agendamentos:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}

// listar todos (ADMIN)
async function listarTodosAgendamentos(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT a.id, a.data_visita, a.hora_visita, a.status, a.observacoes,
             u.nome AS nome_usuario, u.email AS email_usuario,
             an.id AS animal_id, an.nome AS nome_animal, an.tipo AS tipo_animal
      FROM agendamentos a
      JOIN usuarios u ON u.id = a.usuario_id
      JOIN animais an ON an.id = a.animal_id
      ORDER BY a.data_visita, a.hora_visita
    `);

    return res.json(rows);

  } catch (erro) {
    console.error("Erro ao listar todos:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}

// atualizar status
async function atualizarStatusAgendamento(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ mensagem: "Status é obrigatório." });
    }

    const { rowCount } = await pool.query(
      "UPDATE agendamentos SET status = $1 WHERE id = $2",
      [status.toUpperCase(), id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Agendamento não encontrado." });
    }

    return res.json({ mensagem: "Status atualizado com sucesso." });

  } catch (erro) {
    console.error("Erro ao atualizar status:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}

// deletar
async function deletarAgendamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuario?.id;
  const tipoUsuario = req.usuario?.tipo;

  try {
    const { rows } = await pool.query(
      "SELECT usuario_id FROM agendamentos WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Agendamento não encontrado." });
    }

    if (tipoUsuario !== "ADMIN" && rows[0].usuario_id !== usuarioId) {
      return res.status(403).json({ mensagem: "Sem permissão." });
    }

    await pool.query("DELETE FROM agendamentos WHERE id = $1", [id]);

    return res.json({ mensagem: "Agendamento removido com sucesso." });

  } catch (erro) {
    console.error("Erro ao deletar:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}

// fluxo de agendamento
async function iniciarFluxoAgendamento(req, res) {
  const { animalId } = req.params;
  const usuarioId = req.usuario?.id;

  try {
    const { rows: animalRows } = await pool.query(
      "SELECT * FROM animais WHERE id = $1",
      [animalId]
    );

    if (animalRows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    const animal = animalRows[0];

    const disponivel = (animal.status || "").toUpperCase() === "DISPONIVEL";

    let possuiAgendamentoAtivo = false;

    if (usuarioId) {
      const { rows: existe } = await pool.query(
        `SELECT id FROM agendamentos
         WHERE usuario_id = $1 AND animal_id = $2
         AND status IN ('PENDENTE', 'CONFIRMADO')`,
        [usuarioId, animalId]
      );

      possuiAgendamentoAtivo = existe.length > 0;
    }

    return res.json({
      animal,
      disponivel,
      possuiAgendamentoAtivo,
    });

  } catch (erro) {
    console.error("Erro fluxo:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}

module.exports = {
  criarAgendamento,
  listarMeusAgendamentos,
  listarTodosAgendamentos,
  atualizarStatusAgendamento,
  deletarAgendamento,
  iniciarFluxoAgendamento
};