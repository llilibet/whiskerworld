// ── Business Logic Layer: auth ───────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';
import { getUsuarioLogado } from '../services/api';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const result = await usuariosService.login({ email, senha });
      const tipo = result?.usuario?.tipo;
      if (tipo === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
      return result;
    } catch (e) {
      setErro(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    usuariosService.logout();
    navigate('/');
  }, [navigate]);

  const usuarioAtual = getUsuarioLogado();

  return { login, logout, loading, erro, usuarioAtual };
}
