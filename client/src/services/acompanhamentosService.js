import { api } from './api';

export const acompanhamentosService = {
  listar: (adocaoId) =>
    api.getAuth(
      `/acompanhamentos/${encodeURIComponent(adocaoId)}`
    ),

  registrar: (adocaoId, dados, foto = null) => {
    const formulario = new FormData();

    formulario.append(
      'data_acompanhamento',
      dados.data_acompanhamento
    );

    formulario.append('descricao', dados.descricao);

    if (foto) {
      formulario.append('foto', foto);
    }

    return api.postFormAuth(
      `/acompanhamentos/${encodeURIComponent(adocaoId)}`,
      formulario
    );
  },
};