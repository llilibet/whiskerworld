// ── Service Layer: usuários ──────────────────────────────────────────────────
import { api, setToken, clearToken } from './api';

export const usuariosService = {
  registrar: (dados) => api.post('/usuarios/registro', dados),
  login: async (dados) => {
    const result = await api.post('/usuarios/login', dados);
    if (result?.token) setToken(result.token);
    return result;
  },
  logout: () => clearToken(),
  perfil: () => api.getAuth('/usuarios/me'),
};
