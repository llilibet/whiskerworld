const adocoesRepository = require('../repositories/adocoesRepository');
const acompanhamentosRepository = require('../repositories/acompanhamentosRepository');
const AppError = require('../errors/AppError');
const fotosAcompanhamentoService = require('./fotosAcompanhamentoService');

async function verificarAcesso(adocaoId, usuario, paraRegistrar = false) {
  if (!usuario || !usuario.id) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  if (
    typeof adocaoId !== 'string' ||
    !adocaoId.trim() ||
    adocaoId.includes('/')
  ) {
    throw new AppError('Identificação da adoção inválida.', 400);
  }

  const adocao = await adocoesRepository.buscarPorId(adocaoId);

  if (!adocao) {
    throw new AppError('Adoção não encontrada.', 404);
  }

  const adotanteResponsavel =
    usuario.tipo === 'ADOTANTE' &&
    adocao.usuario_id === usuario.id;

  const administrador = usuario.tipo === 'ADMIN';

  if (
    (paraRegistrar && !adotanteResponsavel) ||
    (!paraRegistrar && !adotanteResponsavel && !administrador)
  ) {
    throw new AppError(
      'Você não tem permissão para acessar este acompanhamento.',
      403
    );
  }

  if (adocao.status !== 'APROVADA') {
    throw new AppError(
      'O acompanhamento está disponível somente para adoções aprovadas.',
      400
    );
  }

  return adocao;
}

function validarData(valor) {
  if (
    typeof valor !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(valor)
  ) {
    throw new AppError(
      'Informe a data do acompanhamento no formato AAAA-MM-DD.',
      400
    );
  }

  const data = new Date(`${valor}T00:00:00.000Z`);

  if (
    Number.isNaN(data.getTime()) ||
    data.toISOString().slice(0, 10) !== valor
  ) {
    throw new AppError('Informe uma data válida.', 400);
  }

  return valor;
}

async function registrarAcompanhamento(
  adocaoId,
  dados,
  usuario,
  foto = null
) {
  const adocao = await verificarAcesso(adocaoId, usuario, true);

  const descricao =
    typeof dados?.descricao === 'string'
      ? dados.descricao.trim()
      : '';

  if (!descricao) {
    throw new AppError('A descrição é obrigatória.', 400);
  }

  if (descricao.length > 5000) {
    throw new AppError(
      'A descrição deve ter no máximo 5.000 caracteres.',
      400
    );
  }

  const dataAcompanhamento = validarData(
    dados?.data_acompanhamento
  );

  let dadosFoto = null;

  if (foto) {
    dadosFoto = await fotosAcompanhamentoService.salvarFoto(foto);
  }

  try {
    return await acompanhamentosRepository.criar({
      adocao_id: adocao.id,
      animal_id: adocao.animal_id,
      usuario_id: adocao.usuario_id,
      data_acompanhamento: dataAcompanhamento,
      descricao,
      ...(dadosFoto || {}),
    });
  } catch (erro) {
    if (dadosFoto) {
      try {
        await fotosAcompanhamentoService.excluirFoto(
          dadosFoto.foto_caminho
        );
      } catch (erroLimpeza) {
        console.error(
          'Não foi possível remover a foto após falha no registro:',
          erroLimpeza
        );
      }
    }

    throw erro;
  }
}

async function listarAcompanhamentos(adocaoId, usuario) {
  const adocao = await verificarAcesso(adocaoId, usuario);

  const registros =
    await acompanhamentosRepository.listarPorAdocao(adocao.id);

  return Promise.all(
    registros.map(async (registro) => {
      const {
        foto_caminho,
        ...dadosPublicos
      } = registro;

      if (!foto_caminho) {
        return dadosPublicos;
      }

      const fotoUrl =
        await fotosAcompanhamentoService.obterUrlTemporaria(
          foto_caminho
        );

      return {
        ...dadosPublicos,
        foto_url: fotoUrl,
      };
    })
  );
}

module.exports = {
  registrarAcompanhamento,
  listarAcompanhamentos,
};