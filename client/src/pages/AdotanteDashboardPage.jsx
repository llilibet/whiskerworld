import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getUsuarioLogado } from '../services/api';
import { favoritosService } from '../services/favoritosService';
import { agendamentosService } from '../services/agendamentosService';
import { usuariosService } from '../services/usuariosService';

const BASE = import.meta.env.VITE_API_URL || '';

const STATUS_MAP = {
  PENDENTE:   { label: 'Pendente',   cls: 'status-badge--pendente' },
  CONFIRMADO: { label: 'Confirmado', cls: 'status-badge--confirmado' },
  CANCELADO:  { label: 'Cancelado',  cls: 'status-badge--cancelado' },
};

function formatDateTime(data, hora) {
  if (!data) return '—';
  const d = new Date(data + 'T00:00:00');
  const dateStr = d.toLocaleDateString('pt-BR');
  return hora ? `${dateStr}, ${hora.slice(0, 5)}` : dateStr;
}

export default function AdotanteDashboardPage() {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const [favoritos, setFavoritos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [favs, agends] = await Promise.all([
        favoritosService.listar(),
        agendamentosService.listarMeus(),
      ]);
      setFavoritos(favs || []);
      setAgendamentos(agends || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRemoverFavorito = async (animalId) => {
    try {
      await favoritosService.remover(animalId);
      setFavoritos(f => f.filter(fav => fav.animal_id !== animalId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelarAgendamento = async (id) => {
    if (!window.confirm('Cancelar este agendamento?')) return;
    try {
      await agendamentosService.deletar(id);
      setAgendamentos(a => a.filter(ag => ag.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleLogout = () => {
    usuariosService.logout();
    navigate('/');
  };

  return (
    <div className="page" style={{ background: '#f3f7f0' }}>
      <Navbar variant="adotante" />

      <main className="adotante-main">
        {/* ── Welcome ── */}
        <div className="welcome-card">
          <div>
            <p className="welcome-card__greeting">🐾 Bem-vinda(o) de volta,</p>
            <h1 className="welcome-card__name">{usuario?.nome || 'Adotante'}</h1>
          </div>
          <button className="btn btn--outline-red" onClick={handleLogout}>← Sair</button>
        </div>

        {/* ── Explore Banner ── */}
        <div className="explore-banner">
          <div>
            <h2 className="explore-banner__title">🔍 Encontre seu novo amigo</h2>
            <p className="explore-banner__desc">
              Temos vários pets esperando por um lar. Gatos, cães e muito amor!
            </p>
            <button className="btn btn--green" onClick={() => navigate('/animais')}>
              Explorar Pets →
            </button>
          </div>
          <div className="explore-banner__emojis" aria-hidden="true">
            <span>🐱</span><span>🐕</span><span>🐾</span><span>❤️</span>
          </div>
        </div>

        {/* ── Meus Favoritos ── */}
        <div className="fav-panel">
          <div className="fav-panel__header">
            <h2 className="fav-panel__title">💚 Meus Favoritos</h2>
            <span className="badge-count-pink">
              {favoritos.length} favorito{favoritos.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <p className="muted">Carregando...</p>
          ) : favoritos.length === 0 ? (
            <p className="muted">Nenhum favorito ainda. Explore os pets e adicione!</p>
          ) : (
            <div className="fav-cards">
              {favoritos.map(fav => (
                <div key={fav.id} className="fav-card">
                  <button
                    className="fav-card__remove"
                    onClick={() => handleRemoverFavorito(fav.animal_id)}
                    title="Remover favorito"
                  >✕</button>
                  {fav.animal_foto
                    ? <img className="fav-card__img" src={`${BASE}${fav.animal_foto}`} alt={fav.animal_nome} />
                    : <div className="fav-card__img fav-card__img--empty">🐾</div>
                  }
                  <div className="fav-card__body">
                    <p className="fav-card__name">🐾 {fav.animal_nome}</p>
                    <div className="fav-card__btns">
                      <button
                        className="btn btn--xs btn--xs-outline"
                        onClick={() => navigate(`/animais/animal/${fav.animal_id}`)}
                      >👁 Ver</button>
                      <button
                        className="btn btn--xs btn--green"
                        onClick={() => navigate(`/agendar/${fav.animal_id}`)}
                      >📅 Agendar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Meus Agendamentos ── */}
        <div className="fav-panel">
          <div className="fav-panel__header">
            <h2 className="fav-panel__title">📅 Meus Agendamentos</h2>
            {agendamentos.length > 0 && (
              <span className="badge-count-green">
                {agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <p className="muted">Carregando...</p>
          ) : agendamentos.length === 0 ? (
            <p className="muted">Nenhum agendamento ainda.</p>
          ) : (
            <div className="agend-list">
              {agendamentos.map(ag => {
                const st = STATUS_MAP[ag.status] || { label: ag.status, cls: '' };
                return (
                  <div key={ag.id} className="agend-item">
                    <div className="agend-item__info">
                      <p className="agend-item__animal">🐾 {ag.nome_animal}</p>
                      <p className="agend-item__date">
                        📅 {formatDateTime(ag.data_visita, ag.hora_visita)}
                      </p>
                    </div>
                    <div className="agend-item__right">
                      <span className={`status-badge ${st.cls}`}>
                        {ag.status === 'CONFIRMADO' ? '✓' : ag.status === 'CANCELADO' ? '✕' : '⏳'} {st.label.toUpperCase()}
                      </span>
                      {ag.status !== 'CANCELADO' && (
                        <button
                          className="btn btn--outline-red btn--xs"
                          onClick={() => handleCancelarAgendamento(ag.id)}
                        >✕ Cancelar</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
