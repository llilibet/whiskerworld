// ── Service Layer: animais ───────────────────────────────────────────────────
import { api } from './api';

export const animaisService = {
  listar: (tipo) => api.get(`/animais${tipo ? `?tipo=${tipo}` : ''}`),
  listarAdmin: () => api.getAuth('/animais/admin'),
  obterPorId: (id) => api.getAuth(`/animais/${id}`),
  criar: (formData) => api.postFormAuth('/animais', formData),
  atualizar: (id, formData) => api.putFormAuth(`/animais/${id}`, formData),
  deletar: (id) => api.deleteAuth(`/animais/${id}`),
};
