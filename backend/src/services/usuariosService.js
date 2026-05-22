const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuariosRepository');

const TOKEN_EXPIRATION = '8h';

async function registrarUsuario({ nome, email, senha, tipo }) {
  if (!nome || !email || !senha) {
    const err = new Error('Nome, email e senha são obrigatórios.');
    err.status = 400;
    throw err;
  }
  nome = nome.trim();
  email = email.trim().toLowerCase();

  const existente = await usuariosRepository.findByEmail(email);
  if (existente) {
    const err = new Error('E-mail já cadastrado.');
    err.status = 409;
    throw err;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  return usuariosRepository.create({ nome, email, senhaHash, tipo: tipo || 'ADOTANTE' });
}

async function loginUsuario({ email, senha }) {
  if (!email || !senha) {
    const err = new Error('Email e senha são obrigatórios.');
    err.status = 400;
    throw err;
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não definido no .env');
  }
  email = email.trim().toLowerCase();

  const usuario = await usuariosRepository.findByEmail(email);
  if (!usuario) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );

  return {
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
  };
}

module.exports = { registrarUsuario, loginUsuario };
