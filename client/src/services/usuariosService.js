// ── Service Layer: usuários ──────────────────────────────────────────────────
import { api, setToken, clearToken } from './api';
import { auth } from '../firebase';
import { signInWithCustomToken } from 'firebase/auth';

export const usuariosService = {
  // Backend cria o usuário no Firebase Auth + Firestore e retorna customToken
  registrar: async (dados) => {
    const result = await api.post('/usuarios/registro', dados);
    if (result?.customToken) {
      const credential = await signInWithCustomToken(auth, result.customToken);
      // Force-refresh para incluir custom claims (tipo, nome) no token
      const freshToken = await credential.user.getIdToken(true);
      setToken(freshToken);
    }
    return result;
  },
  logout: async () => {
    await auth.signOut();
    clearToken();
  },
  perfil: () => api.getAuth('/usuarios/me'),
};

