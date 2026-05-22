// ── Business Logic Layer: animais ────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { animaisService } from '../services/animaisService';

export function useAnimaisAdmin() {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await animaisService.listarAdmin();
      setAnimais(data || []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const deletar = useCallback(async (id) => {
    await animaisService.deletar(id);
    setAnimais((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const porStatus = (status) => animais.filter(
    (a) => (a.status || '').toUpperCase() === status.toUpperCase()
  );

  return { animais, loading, erro, carregar, deletar, porStatus };
}
