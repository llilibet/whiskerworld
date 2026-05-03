const pool = require("../database/connection");

// lista animais, opcionalmente filtrando por tipo (?tipo=GATO ou ?tipo=CAO)
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

// detalhes de um animal específico

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

// cria um novo animal (apenas ADMIN)
async function criarAnimal(req, res) {
  try {
    const { nome, idade, sexo, vacinado, status, tipo, descricao } = req.body;

    // se veio arquivo, monta caminho; senão, permite null
    const foto_url = req.file
      ? `/uploads/animais/${req.file.filename}`
      : null;

    if (!nome || !sexo || !tipo) {
      return res.status(400).json({ mensagem: "Nome, sexo e tipo são obrigatórios." });
    }

    const vacinadoBool = vacinado === "1" || vacinado === "true" || vacinado === true;

    const [resultado] = await pool.query(
      `INSERT INTO animais (nome, idade, sexo, vacinado, status, tipo, descricao, foto_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        idade || null,
        sexo,
        vacinadoBool ? 1 : 0,
        status || "DISPONIVEL",
        tipo,
        descricao || null,
        foto_url,
      ]
    );

    const novoAnimalId = resultado.insertId;

    return res.status(201).json({
      mensagem: "Animal cadastrado com sucesso.",
      animal: {
        id: novoAnimalId,
        nome,
        idade,
        sexo,
        vacinado: vacinadoBool,
        status: status || "DISPONIVEL",
        tipo,
        descricao,
        foto_url,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar animal:", erro);
    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar animal.",
    });
  }
}
 

// atualiza dados de um animal (apenas ADMIN)
// atualiza dados de um animal (apenas ADMIN)
async function atualizarAnimal(req, res) {
  const { id } = req.params;

  try {
    // busca o animal atual primeiro
    const [existe] = await pool.query("SELECT * FROM animais WHERE id = ?", [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado." });
    }

    const animalAtual = existe[0];

    // pega os campos do body de forma segura (pode ser undefined se for multipart sem middleware)
    const body = req.body || {};

    // se houver arquivo enviado (multer), monta foto_url com filename
    const novoArquivo = req.file ? `/uploads/animais/${req.file.filename}` : null;

    // extrai valores do body (se não vier, usa null -> manteremos valores anteriores)
    const {
      nome,
      idade,
      sexo,
      vacinado,
      status,
      tipo,
      descricao,
      foto_url: foto_url_body
    } = body;

    // define valores finais (mantém os atuais quando o campo não foi enviado)
    const nomeFinal = nome || animalAtual.nome;
    const idadeFinal = idade || animalAtual.idade;
    const sexoFinal = (sexo || animalAtual.sexo || "").toString().toUpperCase();
    const tipoFinal = (tipo || animalAtual.tipo || "").toString().toUpperCase();

    // vacinado pode vir como "1"/"0" ou boolean
    const vacinadoFinal = (vacinado !== undefined && vacinado !== null)
      ? (vacinado == "1" || vacinado === 1 || vacinado === true)
      : Boolean(animalAtual.vacinado);

    const statusFinal = (status || animalAtual.status || "DISPONIVEL").toString().toUpperCase();
    const descricaoFinal = (descricao !== undefined && descricao !== null) ? descricao : animalAtual.descricao;

    // prioriza o novo arquivo, depois um foto_url vinda no body (pouco provável em multipart)
    const fotoFinal = novoArquivo || foto_url_body || animalAtual.foto_url;

    await pool.query(
      `UPDATE animais
       SET nome = ?, idade = ?, sexo = ?, vacinado = ?, status = ?, tipo = ?, descricao = ?, foto_url = ?
       WHERE id = ?`,
      [
        nomeFinal,
        idadeFinal,
        sexoFinal,
        vacinadoFinal ? 1 : 0,
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


// remove um animal (apenas ADMIN)
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
