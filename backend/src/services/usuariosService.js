const admin = require('firebase-admin');
const { db } = require('../database/connection');
const usuariosRepository = require('../repositories/usuariosRepository');

async function registrarUsuario({ nome, email, senha, tipo }) {
  if (!nome || !email || !senha) {
    const err = new Error('Nome, email e senha são obrigatórios.');
    err.status = 400;
    throw err;
  }
  nome = nome.trim();
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const err = new Error('Formato de e-mail inválido.');
    err.status = 400;
    throw err;
  }
  if (senha.length < 6) {
    const err = new Error('A senha deve ter pelo menos 6 caracteres.');
    err.status = 400;
    throw err;
  }
  tipo = (tipo || 'ADOTANTE').toUpperCase();

  // Verifica se o e-mail já existe no Firestore
  const existente = await usuariosRepository.findByEmail(email);
  if (existente) {
    const e = new Error('E-mail já cadastrado.');
    e.status = 409;
    throw e;
  }

  // Verifica se o e-mail já existe no Firebase Auth
  try {
    await admin.auth().getUserByEmail(email);
    // Se chegou aqui, o e-mail já existe no Auth
    const e = new Error('E-mail já cadastrado.');
    e.status = 409;
    throw e;
  } catch (err) {
    if (err.status === 409) throw err;
    // auth/user-not-found significa que o e-mail está livre — prosseguir
    if (err.code !== 'auth/user-not-found') throw err;
  }


  try {
    const userRecord = await admin.auth().createUser({
      email,
      password: senha,
      displayName: nome,
    });

    // Claims ficam embutidas no ID token — sem precisar de lookup no Firestore
    await admin.auth().setCustomUserClaims(userRecord.uid, { tipo, nome });

    // Documento no Firestore com UID como ID
    await db.collection('usuarios').doc(userRecord.uid).set({ nome, email, tipo });

    // Custom token para o frontend fazer signInWithCustomToken
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    return {
      usuario: { id: userRecord.uid, nome, email, tipo },
      customToken,
    };
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      const e = new Error('E-mail já cadastrado.');
      e.status = 409;
      throw e;
    }
    if (err.code === 'auth/invalid-email') {
      const e = new Error('Formato de e-mail inválido.');
      e.status = 400;
      throw e;
    }
    if (err.code === 'auth/weak-password' || err.code === 'auth/invalid-password') {
      const e = new Error('Senha fraca. Use pelo menos 6 caracteres.');
      e.status = 400;
      throw e;
    }
    throw err;
  }
}

async function syncGoogleUsuario({ uid, email, nome, tipo }) {
  const docRef = db.collection('usuarios').doc(uid);
  const doc = await docRef.get();
  const tipoFinal = (tipo || 'ADOTANTE').toUpperCase();
  let isNew = false;

  if (!doc.exists) {
    isNew = true;
    await docRef.set({ nome, email, tipo: tipoFinal });
    await admin.auth().setCustomUserClaims(uid, { tipo: tipoFinal, nome });
  } else {
    // Usuário já existe — respeita o tipo cadastrado anteriormente
    const tipoExistente = doc.data().tipo || 'ADOTANTE';
    return { tipo: tipoExistente, nome, isNew: false };
  }

  return { tipo: tipoFinal, nome, isNew };
}

module.exports = { registrarUsuario, syncGoogleUsuario };

