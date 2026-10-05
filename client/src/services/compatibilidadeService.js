import { api } from './api';

export const compatibilidadeService = {
  avaliar: (animalId, respostas) =>
    api.postAuth(
      `/compatibilidade/${encodeURIComponent(animalId)}`,
      { respostas }
    ),
};