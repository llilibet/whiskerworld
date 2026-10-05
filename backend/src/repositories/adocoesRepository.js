const { db } = require('../database/connection');
const AppError = require('../errors/AppError');

async function concluirPorAgendamento(agendamentoId, adminId) {
  const agendamentoRef = db.collection('agendamentos').doc(agendamentoId);

  return db.runTransaction(async (transaction) => {
    const agendamentoDoc = await transaction.get(agendamentoRef);

    if (!agendamentoDoc.exists) {
      throw new AppError('Agendamento não encontrado.', 404);
    }

    const agendamento = agendamentoDoc.data();

    if (!agendamento.animal_id || !agendamento.usuario_id) {
      throw new AppError(
        'O agendamento não possui animal ou adotante vinculado.',
        400
      );
    }

    const animalRef = db.collection('animais').doc(agendamento.animal_id);

    // O ID do animal evita duas adoções para o mesmo pet.
    const adocaoRef = db.collection('adocoes').doc(agendamento.animal_id);

    const animalDoc = await transaction.get(animalRef);
    const adocaoDoc = await transaction.get(adocaoRef);

    if (!animalDoc.exists) {
      throw new AppError('Animal não encontrado.', 404);
    }

    const animal = animalDoc.data();

    if (animal.cadastradoPor !== adminId) {
      throw new AppError(
        'Você não tem permissão para concluir a adoção deste animal.',
        403
      );
    }

    if (agendamento.status !== 'CONFIRMADO') {
      throw new AppError(
        'A adoção só pode ser concluída a partir de uma visita confirmada.',
        400
      );
    }

    if (adocaoDoc.exists || animal.status === 'ADOTADO') {
      throw new AppError('Este animal já possui uma adoção concluída.', 409);
    }

    const dataAtual = new Date().toISOString();

    const adocao = {
      animal_id: agendamento.animal_id,
      usuario_id: agendamento.usuario_id,
      agendamento_id: agendamentoId,
      admin_id: adminId,
      nome_animal: animal.nome || '',
      nome_usuario: agendamento.nome_usuario || '',
      status: 'APROVADA',
      data_adocao: dataAtual,
      criadoEm: dataAtual,
    };

    transaction.set(adocaoRef, adocao);

    transaction.update(animalRef, {
      status: 'ADOTADO',
    });

    transaction.update(agendamentoRef, {
      adocao_id: adocaoRef.id,
    });

    return {
      id: adocaoRef.id,
      ...adocao,
    };
  });
}

async function listarPorAdotante(usuarioId) {
  const snapshot = await db
    .collection('adocoes')
    .where('usuario_id', '==', usuarioId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .sort((a, b) =>
      (b.data_adocao || '').localeCompare(a.data_adocao || '')
    );
}

async function listarMinhasAdocoes(usuario) {
  if (!usuario || !usuario.id) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  if (usuario.tipo !== 'ADOTANTE') {
    throw new AppError(
      'Esta consulta está disponível apenas para adotantes.',
      403
    );
  }

  return adocoesRepository.listarPorAdotante(usuario.id);
}

async function buscarPorId(adocaoId) {
  const documento = await db
    .collection('adocoes')
    .doc(adocaoId)
    .get();

  if (!documento.exists) {
    return null;
  }

  return {
    ...documento.data(),
    id: documento.id,
  };
}

module.exports = {
  concluirPorAgendamento,
  listarPorAdotante,
  buscarPorId,
};