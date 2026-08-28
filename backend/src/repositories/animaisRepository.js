const { db } = require('../database/connection');
const col = db.collection('animais');

async function findAll(tipo = null) {
  const snap = await col.where('status', '==', 'DISPONIVEL').get();
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (tipo) results = results.filter(a => (a.tipo || '').toUpperCase() === tipo.toUpperCase());
  return results.sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
}

async function findAllAdmin(adminId) {
  const snap = await col.where('cadastradoPor', '==', adminId).get();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.criadoEm || '').localeCompare(a.criadoEm || ''));
}

async function findById(id) {
  const doc = await col.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function create({ nome, idade, sexo, vacinado, status, tipo, descricao, foto_url, raca, porte, historico, cadastradoPor }) {
  const data = {
    nome,
    idade: idade || null,
    sexo,
    vacinado: !!vacinado,
    status: status || 'DISPONIVEL',
    tipo,
    descricao: descricao || null,
    raca: raca || null,
    porte: porte || null,
    historico: historico || null,
    foto_url: foto_url || null,
    cadastradoPor: cadastradoPor || null,
    criadoEm: new Date().toISOString(),
  };
  const ref = await col.add(data);
  return { id: ref.id, ...data };
}

async function update(id, { nome, idade, sexo, vacinado, status, tipo, descricao, foto_url, raca, porte, historico }) {
  await col.doc(id).update({ nome, idade, sexo, vacinado: !!vacinado, status, tipo, descricao, foto_url, raca: raca || null, porte: porte || null, historico: historico || null });
}

async function remove(id) {
  const doc = await col.doc(id).get();
  if (!doc.exists) return 0;
  await col.doc(id).delete();
  return 1;
}

module.exports = { findAll, findAllAdmin, findById, create, update, remove };

