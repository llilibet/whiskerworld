const { db } = require('../database/connection');

async function criar(dados) {
  const documento = db.collection('acompanhamentos').doc();

  const acompanhamento = {
    ...dados,
    criadoEm: new Date().toISOString(),
  };

  await documento.set(acompanhamento);

  return {
    ...acompanhamento,
    id: documento.id,
  };
}

async function listarPorAdocao(adocaoId) {
  const resultado = await db
    .collection('acompanhamentos')
    .where('adocao_id', '==', adocaoId)
    .get();

  return resultado.docs
    .map((documento) => ({
      ...documento.data(),
      id: documento.id,
    }))
    .sort((a, b) => {
      const comparacaoData = (a.data_acompanhamento || '')
        .localeCompare(b.data_acompanhamento || '');

      if (comparacaoData !== 0) {
        return comparacaoData;
      }

      return (a.criadoEm || '').localeCompare(b.criadoEm || '');
    });
}

module.exports = {
  criar,
  listarPorAdocao,
};