const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/connection");

// tempo de expiração do token (ex.: 8 horas)
const TOKEN_EXPIRATION = "8h";

async function registrarUsuario(req, res) {
  const { nome, email, senha, tipo } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios." });
    }

    // tipo padrão é ADOTANTE, se não vier nada
    const tipoUsuario = tipo || "ADOTANTE";

    // verifica se o e-mail já existe
    const [rows] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(409).json({ mensagem: "E-mail já cadastrado." });
    }

    // gera hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // insere o usuário
    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)",
      [nome, email, senhaHash, tipoUsuario]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: resultado.insertId,
        nome,
        email,
        tipo: tipoUsuario,
      },
    });
  } catch (erro) {
    console.error("Erro ao registrar usuário:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao registrar usuário." });
  }
}

async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    // busca usuário pelo e-mail
    const [rows] = await pool.query(
      "SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    const usuario = rows[0];

    // confere a senha
    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaConfere) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    // gera token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    return res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    });
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    return res.status(500).json({ mensagem: "Erro interno ao fazer login." });
  }
}

async function retornaUsuarioLogado(req, res) {
  try {
    const usuario = {
      id: req.usuario.id,
      nome: req.usuario.nome,
      email: req.usuario.email,
      tipo: req.usuario.tipo
    };

    return res.json(usuario);
  } catch (erro) {
    console.error("Erro ao retornar usuário logado:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}


// exporta as funções que a rota vai usar
module.exports = {
  registrarUsuario,
  loginUsuario,
  retornaUsuarioLogado
};

