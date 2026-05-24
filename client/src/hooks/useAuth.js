// ── Business Logic Layer: auth ───────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { setToken, clearToken } from '../services/api';

function traduzirErroFirebase(code) {
  const map = {
    'auth/user-not-found': 'E-mail não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um momento.',
    'auth/user-disabled': 'Conta desativada.',
    'auth/invalid-email': 'E-mail inválido.',
  };
  return map[code] || 'Erro de autenticação.';
}

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const redirecionarPorTipo = async (user) => {
    const result = await user.getIdTokenResult();
    const tipo = result.claims.tipo || 'ADOTANTE';
    navigate(tipo === 'ADMIN' ? '/admin' : '/dashboard');
  };

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, senha);
      const token = await credential.user.getIdToken();
      setToken(token);
      await redirecionarPorTipo(credential.user);
    } catch (e) {
      const msg = traduzirErroFirebase(e.code);
      setErro(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loginGoogle = useCallback(async (tipo = 'ADOTANTE') => {
    setLoading(true);
    setErro(null);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;
      const token = await user.getIdToken();
      setToken(token);

      const resp = await fetch('/usuarios/google-sync', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: tipo.toUpperCase() }),
      });
      const data = await resp.json();

      if (data.isNew) {
        const freshToken = await user.getIdToken(true);
        setToken(freshToken);
      }

      const tipoFinal = data.tipo || 'ADOTANTE';
      navigate(tipoFinal === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        const msg = traduzirErroFirebase(e.code);
        setErro(msg);
        throw new Error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    await auth.signOut();
    clearToken();
    navigate('/');
  }, [navigate]);

  return { login, loginGoogle, logout, loading, erro };
}

