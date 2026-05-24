const { db } = require('../database/connection');
const col = db.collection('favoritos');

async function findByUsuario(usuarioId) {
  const snap = await col.where('usuario_id', '==', usuarioId).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function create(usuarioId, animalId) {
  const animalDoc = await db.collection('animais').doc(animalId).get();
  const animalData = animalDoc.exists ? animalDoc.data() : {};
  const ref = await col.add({
    usuario_id: usuarioId,
    animal_id: animalId,
    animal_nome: animalData.nome || '',
    animal_foto: animalData.foto_url || null,
  });
  return { id: ref.id };
}

async function remove(usuarioId, animalId) {
  const snap = await col
    .where('usuario_id', '==', usuarioId)
    .where('animal_id', '==', animalId)
    .get();
  if (snap.empty) return 0;
  await Promise.all(snap.docs.map(d => d.ref.delete()));
  return snap.size;
}

module.exports = { findByUsuario, create, remove };

