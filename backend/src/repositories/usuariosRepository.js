const { db } = require('../database/connection');
const col = db.collection('usuarios');

async function findByEmail(email) {
  const snap = await col.where('email', '==', email).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

async function findById(id) {
  const doc = await col.doc(id).get();
  if (!doc.exists) return null;
  const { senha_hash, ...data } = doc.data();
  return { id: doc.id, ...data };
}

async function create({ nome, email, senhaHash, tipo }) {
  const ref = await col.add({ nome, email, senha_hash: senhaHash, tipo });
  return { id: ref.id, nome, email, tipo };
}

module.exports = { findByEmail, findById, create };

