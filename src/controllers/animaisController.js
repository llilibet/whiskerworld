const pool = require("../database/connection");

/**
 * GET /animais
 * Lista animais, opcionalmente filtrando por tipo (?tipo=GATO ou ?tipo=CAO)
 */
async function listarAnimais(req, res) {
  const { tipo } = req.query;

  try {
    let query = "SELECT * FROM animais WHERE 1=1";
    const params = [];

    if (tipo) {
      query += " AND tipo = ?";
      params.push(tipo.toUpperCase());
    }

    // só animais disponíveis para o público
    query += " AND status = 'DISPONIVEL'";

    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (erro) {
    console.error("Erro ao listar animais:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao listar animais." });
  }
}

/**
 * GET /animais/:id
 * Detalhes de um animal específico
 */
async function obterAnimalPorId(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM animais WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    return res.json(rows[0]);
  } catch (erro) {
    console.error("Erro ao obter animal:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao buscar animal." });
  }
}

/**
 * POST /animais
 * Cria um novo animal (apenas ADMIN)
 */
async function criarAnimal(req, res) {
  const {
    nome,
    idade,
    sexo,
    vacinado,
    status,
    tipo,
    descricao,
    foto_url,
  } = req.body;

  try {
    if (!nome || !sexo || !tipo) {
      return res.status(400).json({
        mensagem: "Nome, sexo e tipo (CAO/GATO) são obrigatórios.",
      });
    }

    const sexoUpper = sexo.toUpperCase();
    const tipoUpper = tipo.toUpperCase();

    const vacinadoValor = vacinado ? 1 : 0;
    const statusValor = status ? status.toUpperCase() : "DISPONIVEL";

    const [resultado] = await pool.query(
      `INSERT INTO animais 
       (nome, idade, sexo, vacinado, status, tipo, descricao, foto_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        idade || null,
        sexoUpper,
        vacinadoValor,
        statusValor,
        tipoUpper,
        descricao || null,
        foto_url || null,
      ]
    );

    return res.status(201).json({
      mensagem: "Animal cadastrado com sucesso.",
      animal: {
        id: resultado.insertId,
        nome,
        idade,
        sexo: sexoUpper,
        vacinado: !!vacinadoValor,
        status: statusValor,
        tipo: tipoUpper,
        descricao,
        foto_url,
      },
    });
  } catch (erro) {
    console.error("Erro ao criar animal:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao cadastrar animal." });
  }
}

/**
 * PUT /animais/:id
 * Atualiza dados de um animal (apenas ADMIN)
 */
async function atualizarAnimal(req, res) {
  const { id } = req.params;
  const {
    nome,
    idade,
    sexo,
    vacinado,
    status,
    tipo,
    descricao,
    foto_url,
  } = req.body;

  try {
    // verifica se existe
    const [existe] = await pool.query("SELECT * FROM animais WHERE id = ?", [
      id,
    ]);
    if (existe.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    const animalAtual = existe[0];

    const nomeFinal = nome || animalAtual.nome;
    const idadeFinal = idade || animalAtual.idade;
    const sexoFinal = (sexo || animalAtual.sexo).toUpperCase();
    const tipoFinal = (tipo || animalAtual.tipo).toUpperCase();
    const vacinadoFinal =
      vacinado !== undefined ? (vacinado ? 1 : 0) : animalAtual.vacinado;
    const statusFinal = (status || animalAtual.status).toUpperCase();
    const descricaoFinal = descricao || animalAtual.descricao;
    const fotoFinal = foto_url || animalAtual.foto_url;

    await pool.query(
      `UPDATE animais
       SET nome = ?, idade = ?, sexo = ?, vacinado = ?, status = ?, tipo = ?, descricao = ?, foto_url = ?
       WHERE id = ?`,
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
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao atualizar animal." });
  }
}

/**
 * DELETE /animais/:id
 * Remove um animal (apenas ADMIN)
 */
async function deletarAnimal(req, res) {
  const { id } = req.params;

  try {
    const [resultado] = await pool.query(
      "DELETE FROM animais WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    return res.json({ mensagem: "Animal removido com sucesso." });
  } catch (erro) {
    console.error("Erro ao deletar animal:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao remover animal." });
  }
}

module.exports = {
  listarAnimais,
  obterAnimalPorId,
  criarAnimal,
  atualizarAnimal,
  deletarAnimal,
};
