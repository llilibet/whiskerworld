/**
 * Script de limpeza — apaga animais sem o campo "cadastradoPor"
 * (criados antes da regra de ownership por admin)
 *
 * Uso: node backend/scripts/limpar-animais-antigos.js
 */

require('../src/database/connection'); // inicializa Firebase Admin
const admin = require('firebase-admin');

const db = admin.firestore();

async function main() {
  const snap = await db.collection('animais').get();

  const semDono = snap.docs.filter(d => !d.data().cadastradoPor);

  if (semDono.length === 0) {
    console.log('Nenhum animal antigo encontrado. Nada a apagar.');
    process.exit(0);
  }

  console.log(`Encontrados ${semDono.length} animal(is) sem dono:`);
  semDono.forEach(d => console.log(`  - [${d.id}] ${d.data().nome || '(sem nome)'}`));

  // Apaga em lotes de 500 (limite do Firestore batch)
  const chunks = [];
  for (let i = 0; i < semDono.length; i += 500) {
    chunks.push(semDono.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    const batch = db.batch();
    chunk.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  console.log(`\n✅ ${semDono.length} animal(is) antigo(s) apagado(s) com sucesso.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
