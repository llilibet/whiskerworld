import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado } from '../services/api';
import { usuariosService } from '../services/usuariosService';

const PERFIS = {
  ADOTANTE: { label: 'Adotante', icone: '💚', area: '/dashboard', areaLabel: 'Minha área' },
  ADMIN: { label: 'Administrador', icone: '🛡️', area: '/admin', areaLabel: 'Painel administrativo' },
};

// Menu da conta exibido nas áreas autenticadas: mostra o perfil atual e
// permite trocar de perfil sem precisar voltar à tela inicial.
export default function ContaMenu() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    const fechar = (e) => { if (ref.current && !ref.current.contains(e.target)) setAberto(false); };
    const esc = (e) => { if (e.key === 'Escape') setAberto(false); };
    document.addEventListener('mousedown', fechar);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fechar);
      document.removeEventListener('keydown', esc);
    };
  }, [aberto]);

  if (!usuario) return null;

  const tipoAtual = usuario.tipo === 'ADMIN' ? 'ADMIN' : 'ADOTANTE';
  const outroTipo = tipoAtual === 'ADMIN' ? 'ADOTANTE' : 'ADMIN';
  const atual = PERFIS[tipoAtual];
  const outro = PERFIS[outroTipo];

  const trocarPerfil = async () => {
    await usuariosService.logout();
    navigate(`/login?tipo=${outroTipo}`);
  };

  const sair = async () => {
    await usuariosService.logout();
    navigate('/');
  };

  return (
    <div className="conta-menu" ref={ref}>
      <button
        type="button"
        className="conta-menu__toggle"
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((v) => !v)}
      >
        <span className="conta-menu__avatar" aria-hidden="true">{atual.icone}</span>
        <span className="conta-menu__info">
          <span className="conta-menu__nome">{usuario.nome || atual.label}</span>
          <span className="conta-menu__perfil">Perfil: {atual.label}</span>
        </span>
        <span className="conta-menu__seta" aria-hidden="true">▾</span>
      </button>

      {aberto && (
        <div className="conta-menu__dropdown" role="menu">
          <p className="conta-menu__secao">Você está como <strong>{atual.label}</strong></p>
          <button type="button" role="menuitem" className="conta-menu__item" onClick={() => { setAberto(false); navigate(atual.area); }}>
            🏠 {atual.areaLabel}
          </button>
          <button type="button" role="menuitem" className="conta-menu__item conta-menu__item--destaque" onClick={trocarPerfil}>
            🔄 Trocar para perfil {outro.label}
          </button>
          <hr className="conta-menu__divisor" />
          <button type="button" role="menuitem" className="conta-menu__item" onClick={sair}>
            ↩ Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}
