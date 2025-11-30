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

    // NOVO: verifica duplicidade de agendamento
    const [existe] = await pool.query(
      `SELECT id FROM agendamentos
       WHERE usuario_id = ? AND animal_id = ? AND status IN ('PENDENTE', 'CONFIRMADO')`,
      [usuarioId, animal_id]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        mensagem: "Você já possui um agendamento ativo para este animal."
      });
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
       an.id AS animal_id, an.nome AS nome_animal, an.tipo AS tipo_animal
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

async function deletarAgendamento(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuario.id;
  const tipoUsuario = req.usuario.tipo;

  try {
    const [rows] = await pool.query(
      "SELECT usuario_id FROM agendamentos WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Agendamento não encontrado." });
    }

    const agendamento = rows[0];

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

// listar agendamentos do usuário (rota /agendamentos/me no seu front)
async function listarDoUsuario(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.data_visita,
        a.hora_visita,
        a.status,
        an.nome AS animal_nome
      FROM agendamentos a
      LEFT JOIN animais an ON an.id = a.animal_id
      WHERE a.usuario_id = ?
      ORDER BY a.data_visita DESC, a.hora_visita DESC
    `, [usuarioId]);

    return res.json(rows);

  } catch (erro) {
    console.error("Erro listarDoUsuario:", erro);
    return res.status(500).json({ mensagem: "Erro ao buscar seus agendamentos." });
  }
}

// iniciar fluxo de agendamento 
async function iniciarFluxoAgendamento(req, res) {
  const { animalId } = req.params;
  const usuarioId = req.usuario && req.usuario.id; // pode ser undefined se não autenticado

  try {
    // verifica se o animal existe
    const [animalRows] = await pool.query(
      "SELECT id, nome, idade, sexo, vacinado, status, tipo, descricao, foto_url FROM animais WHERE id = ?",
      [animalId]
    );

    if (animalRows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    const animal = animalRows[0];

    // verifica disponibilidade pública
    const disponivel = (animal.status || "").toString().toUpperCase() === "DISPONIVEL";
    if (!disponivel) {
      return res.status(200).json({
        animal: {
          id: animal.id,
          nome: animal.nome,
          idade: animal.idade,
          sexo: animal.sexo,
          vacinado: Boolean(animal.vacinado),
          status: animal.status,
          tipo: animal.tipo,
          descricao: animal.descricao,
          foto_url: animal.foto_url
        },
        disponivel: false,
        mensagem: "Animal não disponível para adoção."
      });
    }

    // verificar se o usuário autenticado já tem agendamento pendente/confirmado para este animal
    let possuiAgendamentoAtivo = false;
    if (usuarioId) {
      const [existe] = await pool.query(
        `SELECT id FROM agendamentos
         WHERE usuario_id = ? AND animal_id = ? AND status IN ('PENDENTE', 'CONFIRMADO')`,
        [usuarioId, animalId]
      );
      possuiAgendamentoAtivo = (existe.length > 0);
    }

    // retorna JSON com dados essenciais
    return res.status(200).json({
      animal: {
        id: animal.id,
        nome: animal.nome,
        idade: animal.idade,
        sexo: animal.sexo,
        vacinado: Boolean(animal.vacinado),
        status: animal.status,
        tipo: animal.tipo,
        descricao: animal.descricao,
        foto_url: animal.foto_url
      },
      disponivel: true,
      possuiAgendamentoAtivo,
      mensagem: "Dados para iniciar agendamento."
    });
  } catch (erro) {
    console.error("Erro iniciarFluxoAgendamento:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao iniciar fluxo de agendamento." });
  }
}


module.exports = {
  criarAgendamento,
  listarMeusAgendamentos,
  listarTodosAgendamentos,
  atualizarStatusAgendamento,
  deletarAgendamento,
  listarDoUsuario,
  iniciarFluxoAgendamento
};
