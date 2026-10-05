import { api } from './api';

export const adocoesService = {
  listarMinhas: () => api.getAuth('/adocoes/me'),

  concluir: (agendamentoId) =>
    api.postAuth(
      `/adocoes/agendamento/${encodeURIComponent(agendamentoId)}`,
      {}
    ),
};