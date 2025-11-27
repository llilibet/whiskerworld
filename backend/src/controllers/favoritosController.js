const pool = require("../database/connection");

async function listarFavoritos(req, res) {
  try {
    const usuarioId = req.usuario && req.usuario.id;
    if (!usuarioId) return res.status(401).json({ mensagem: "Usuário não autenticado." });

    const [rows] = await pool.query(`
      SELECT f.id, f.usuario_id, f.animal_id,
             a.nome AS animal_nome, a.foto_url AS animal_foto
      FROM favoritos f
      LEFT JOIN animais a ON a.id = f.animal_id
      WHERE f.usuario_id = ?
    `, [usuarioId]);

    return res.json(rows);
  } catch (erro) {
    console.error("Erro listarFavoritos:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao listar favoritos." });
  }
}

async function criarFavorito(req, res) {
  try {
    const usuarioId = req.usuario && req.usuario.id;
    const { animal_id } = req.body;
    if (!usuarioId) return res.status(401).json({ mensagem: "Usuário não autenticado." });
    if (!animal_id) return res.status(400).json({ mensagem: "animal_id obrigatório." });

    const [r] = await pool.query("INSERT INTO favoritos (usuario_id, animal_id) VALUES (?, ?)", [usuarioId, animal_id]);
    return res.status(201).json({ mensagem: "Favorito criado.", id: r.insertId });
  } catch (erro) {
    console.error("Erro criarFavorito:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao criar favorito." });
  }
}

// removerFavorito: remove favorito pelo animal_id do usuário autenticado
async function removerFavorito(req, res) {
  try {
    const usuarioId = req.usuario && req.usuario.id;
    const { animal_id } = req.params;

    if (!usuarioId) return res.status(401).json({ mensagem: "Usuário não autenticado." });
    if (!animal_id) return res.status(400).json({ mensagem: "animal_id obrigatório na rota." });

    // exclui o favorito correspondente ao usuário + animal
    const [result] = await pool.query(
      "DELETE FROM favoritos WHERE usuario_id = ? AND animal_id = ?",
      [usuarioId, animal_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Favorito não encontrado." });
    }

    return res.json({ mensagem: "Favorito removido com sucesso." });
  } catch (erro) {
    console.error("Erro removerFavorito:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao remover favorito." });
  }
}

module.exports = { listarFavoritos, criarFavorito, removerFavorito };

