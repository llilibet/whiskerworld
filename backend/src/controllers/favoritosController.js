const pool = require("../database/connection");

async function listarFavoritos(req, res) {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: "Usuário não autenticado." });
    }

    const { rows } = await pool.query(
      `SELECT f.id, f.usuario_id, f.animal_id,
              a.nome AS animal_nome,
              a.foto_url AS animal_foto
       FROM favoritos f
       LEFT JOIN animais a ON a.id = f.animal_id
       WHERE f.usuario_id = $1`,
      [usuarioId]
    );

    return res.json(rows);

  } catch (erro) {
    console.error("Erro listarFavoritos:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao listar favoritos." });
  }
}

async function criarFavorito(req, res) {
  try {
    const usuarioId = req.usuario?.id;
    const { animal_id } = req.body;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: "Usuário não autenticado." });
    }

    if (!animal_id) {
      return res.status(400).json({ mensagem: "animal_id obrigatório." });
    }

    const { rows } = await pool.query(
      `INSERT INTO favoritos (usuario_id, animal_id)
       VALUES ($1, $2)
       RETURNING id`,
      [usuarioId, animal_id]
    );

    return res.status(201).json({
      mensagem: "Favorito criado.",
      id: rows[0].id,
    });

  } catch (erro) {
    console.error("Erro criarFavorito:", erro);

    // tratamento de duplicidade (caso já favoritado)
    if (erro.code === "23505") {
      return res.status(409).json({ mensagem: "Esse animal já está nos favoritos." });
    }

    return res.status(500).json({ mensagem: "Erro interno ao criar favorito." });
  }
}

// removerFavorito: remove favorito pelo animal_id do usuário autenticado
async function removerFavorito(req, res) {
  try {
    const usuarioId = req.usuario?.id;
    const { animal_id } = req.params;

    if (!usuarioId) {
      return res.status(401).json({ mensagem: "Usuário não autenticado." });
    }

    if (!animal_id) {
      return res.status(400).json({ mensagem: "animal_id obrigatório na rota." });
    }

    const { rowCount } = await pool.query(
      `DELETE FROM favoritos
       WHERE usuario_id = $1 AND animal_id = $2`,
      [usuarioId, animal_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Favorito não encontrado." });
    }

    return res.json({ mensagem: "Favorito removido com sucesso." });

  } catch (erro) {
    console.error("Erro removerFavorito:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao remover favorito." });
  }
}

module.exports = {
  listarFavoritos,
  criarFavorito,
  removerFavorito
};