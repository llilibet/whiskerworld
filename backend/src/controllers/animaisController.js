const pool = require("../database/connection");

// listar animais
async function listarAnimais(req, res) {
  const { tipo } = req.query;

  try {
    let query = "SELECT * FROM animais WHERE status = 'DISPONIVEL'";
    const params = [];

    if (tipo) {
      params.push(tipo.toUpperCase());
      query += ` AND tipo = $${params.length}`;
    }

    const { rows } = await pool.query(query, params);
    return res.json(rows);

  } catch (erro) {
    console.error("Erro ao listar animais:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao listar animais." });
  }
}

// obter animal por id
async function obterAnimalPorId(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM animais WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    return res.json(rows[0]);

  } catch (erro) {
    console.error("Erro ao obter animal:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao buscar animal." });
  }
}

// criar animal
async function criarAnimal(req, res) {
  try {
    const { nome, idade, sexo, vacinado, status, tipo, descricao } = req.body;

    if (!nome || !sexo || !tipo) {
      return res.status(400).json({ mensagem: "Nome, sexo e tipo são obrigatórios." });
    }

    const foto_url = req.file
      ? `/uploads/animais/${req.file.filename}`
      : null;

    const vacinadoBool =
      vacinado === "1" || vacinado === "true" || vacinado === true;

    const { rows } = await pool.query(
      `INSERT INTO animais (nome, idade, sexo, vacinado, status, tipo, descricao, foto_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        nome,
        idade || null,
        sexo,
        vacinadoBool,
        status || "DISPONIVEL",
        tipo,
        descricao || null,
        foto_url,
      ]
    );

    return res.status(201).json({
      mensagem: "Animal cadastrado com sucesso.",
      animal: rows[0],
    });

  } catch (erro) {
    console.error("Erro ao cadastrar animal:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar animal.",
    });
  }
}

// atualizar animal
async function atualizarAnimal(req, res) {
  const { id } = req.params;

  try {
    const { rows: existente } = await pool.query(
      "SELECT * FROM animais WHERE id = $1",
      [id]
    );

    if (existente.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    const atual = existente[0];
    const body = req.body || {};

    const novoArquivo = req.file
      ? `/uploads/animais/${req.file.filename}`
      : null;

    const nomeFinal = body.nome || atual.nome;
    const idadeFinal = body.idade || atual.idade;
    const sexoFinal = (body.sexo || atual.sexo).toUpperCase();
    const tipoFinal = (body.tipo || atual.tipo).toUpperCase();

    const vacinadoFinal =
      body.vacinado !== undefined
        ? body.vacinado == "1" || body.vacinado === true
        : atual.vacinado;

    const statusFinal = (body.status || atual.status).toUpperCase();
    const descricaoFinal =
      body.descricao !== undefined ? body.descricao : atual.descricao;

    const fotoFinal =
      novoArquivo || body.foto_url || atual.foto_url;

    await pool.query(
      `UPDATE animais
       SET nome = $1,
           idade = $2,
           sexo = $3,
           vacinado = $4,
           status = $5,
           tipo = $6,
           descricao = $7,
           foto_url = $8
       WHERE id = $9`,
      [
        nomeFinal,
        idadeFinal,
        sexoFinal,
        vacinadoFinal,
        statusFinal,
        tipoFinal,
        descricaoFinal,
        fotoFinal,
        id,
      ]
    );

    return res.json({ mensagem: "Animal atualizado com sucesso." });

  } catch (erro) {
    console.error("Erro ao atualizar animal:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao atualizar animal.",
    });
  }
}

// deletar animal
async function deletarAnimal(req, res) {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM animais WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    return res.json({ mensagem: "Animal removido com sucesso." });

  } catch (erro) {
    console.error("Erro ao deletar animal:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao remover animal.",
    });
  }
}

module.exports = {
  listarAnimais,
  obterAnimalPorId,
  criarAnimal,
  atualizarAnimal,
  deletarAnimal,
};