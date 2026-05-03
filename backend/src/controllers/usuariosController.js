const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../database/connection");

const TOKEN_EXPIRATION = "8h";

async function registrarUsuario(req, res) {
  let { nome, email, senha, tipo } = req.body;

  try {
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: "Nome, email e senha são obrigatórios." });
    }

    // normalização
    nome = nome.trim();
    email = email.trim().toLowerCase();

    const tipoUsuario = tipo || "ADOTANTE";

    // verifica se já existe
    const { rows: usuarioExistente } = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuarioExistente.length > 0) {
      return res.status(409).json({ mensagem: "E-mail já cadastrado." });
    }

    // hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // insert
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, tipo`,
      [nome, email, senhaHash, tipoUsuario]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: rows[0],
    });

  } catch (erro) {
    console.error("Erro ao registrar usuário:", erro);

    // tratamento de duplicidade (Postgres)
    if (erro.code === "23505") {
      return res.status(409).json({ mensagem: "E-mail já cadastrado." });
    }

    return res.status(500).json({ mensagem: "Erro interno ao registrar usuário." });
  }
}

async function loginUsuario(req, res) {
  let { email, senha } = req.body;

  try {
    if (!email || !senha) {
      return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    email = email.trim().toLowerCase();

    // valida secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não definido no .env");
    }

    const { rows } = await pool.query(
      "SELECT id, nome, email, senha_hash, tipo FROM usuarios WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

    const usuario = rows[0];

    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaConfere) {
      return res.status(401).json({ mensagem: "Credenciais inválidas." });
    }

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

    return res.status(200).json({
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
    if (!req.usuario) {
      return res.status(401).json({ mensagem: "Não autenticado." });
    }

    return res.json({
      id: req.usuario.id,
      nome: req.usuario.nome,
      email: req.usuario.email,
      tipo: req.usuario.tipo,
    });

  } catch (erro) {
    console.error("Erro ao retornar usuário logado:", erro);
    return res.status(500).json({ mensagem: "Erro interno." });
  }
}

module.exports = {
  registrarUsuario,
  loginUsuario,
  retornaUsuarioLogado
};