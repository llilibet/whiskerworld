// ── Service Layer: favoritos ─────────────────────────────────────────────────
import { api } from './api';

export const favoritosService = {
  listar: () => api.getAuth('/favoritos'),
  criar: (animal_id) => api.postAuth('/favoritos', { animal_id }),
  remover: (animal_id) => api.deleteAuth(`/favoritos/${animal_id}`),
};
