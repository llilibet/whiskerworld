// ── Service Layer: agendamentos ──────────────────────────────────────────────
import { api } from './api';

export const agendamentosService = {
  listarTodos: () => api.getAuth('/agendamentos'),
  listarMeus: () => api.getAuth('/agendamentos/me'),
  criar: (dados) => api.postAuth('/agendamentos', dados),
  atualizarStatus: (id, status) => api.putAuth(`/agendamentos/${id}/status`, { status }),
  deletar: (id) => api.deleteAuth(`/agendamentos/${id}`),
  obterHorariosOcupados: (data) => api.get(`/agendamentos/horarios-ocupados?data=${data}`),
};
