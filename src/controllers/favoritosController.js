const pool = require("../database/connection");

/**
 * POST /favoritos
 * Adiciona um animal aos favoritos do usuário logado
 */
async function adicionarFavorito(req, res) {
  const usuarioId = req.usuario.id;
  const { animal_id } = req.body;

  try {
    if (!animal_id) {
      return res
        .status(400)
        .json({ mensagem: "animal_id é obrigatório." });
    }

    // verifica se animal existe
    const [animalRows] = await pool.query(
      "SELECT id, nome FROM animais WHERE id = ?",
      [animal_id]
    );

    if (animalRows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    // tenta inserir nos favoritos
    await pool.query(
      "INSERT INTO favoritos (usuario_id, animal_id) VALUES (?, ?)",
      [usuarioId, animal_id]
    );

    return res.status(201).json({
      mensagem: "Animal adicionado aos favoritos.",
    });
  } catch (erro) {
    // se já existe, a constraint UNIQUE gera erro
    if (erro.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ mensagem: "Este animal já está nos seus favoritos." });
    }

    console.error("Erro ao adicionar favorito:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao adicionar favorito." });
  }
}

/**
 * GET /favoritos/me
 * Lista os animais favoritados pelo usuário logado
 */
async function listarMeusFavoritos(req, res) {
  const usuarioId = req.usuario.id;

  try {
    const [rows] = await pool.query(
      `SELECT f.id AS favorito_id,
              an.id AS animal_id,
              an.nome,
              an.idade,
              an.sexo,
              an.vacinado,
              an.status,
              an.tipo,
              an.descricao,
              an.foto_url
       FROM favoritos f
       JOIN animais an ON an.id = f.animal_id
       WHERE f.usuario_id = ?
       ORDER BY f.created_at DESC`,
      [usuarioId]
    );

    return res.json(rows);
  } catch (erro) {
    console.error("Erro ao listar favoritos:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao listar favoritos." });
  }
}

// remove um animal dos favoritos do usuário logado

async function removerFavorito(req, res) {
  const usuarioId = req.usuario.id;
  const { animal_id } = req.params;

  try {
    const [resultado] = await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = ? AND animal_id = ?",
      [usuarioId, animal_id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Este animal não está nos seus favoritos.",
      });
    }

    return res.json({ mensagem: "Animal removido dos favoritos." });
  } catch (erro) {
    console.error("Erro ao remover favorito:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao remover favorito." });
  }
}

module.exports = {
  adicionarFavorito,
  listarMeusFavoritos,
  removerFavorito,
};
