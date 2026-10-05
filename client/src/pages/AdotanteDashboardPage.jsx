import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUsuarioLogado } from '../services/api';
import { favoritosService } from '../services/favoritosService';
import { agendamentosService } from '../services/agendamentosService';
import { usuariosService } from '../services/usuariosService';
import { adocoesService } from '../services/adocoesService';

const BASE = import.meta.env.VITE_API_URL || '';

const PALAVRA_CONFIRMACAO = 'EXCLUIR';

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
  const [exclusaoAberta, setExclusaoAberta] = useState(false);
  const [excluindoConta, setExcluindoConta] = useState(false);
  const [textoConfirmacao, setTextoConfirmacao] = useState('');

  const [adocoes, setAdocoes] = useState([]);
  const [carregandoAdocoes, setCarregandoAdocoes] = useState(true);
  const [erroAdocoes, setErroAdocoes] = useState('');

  useEffect(() => {
    let ativo = true;

    adocoesService.listarMinhas()
      .then((dados) => {
        if (ativo) {
          setAdocoes(dados || []);
        }
      })
      .catch((erro) => {
        if (ativo) {
          setErroAdocoes(
            erro.message || 'Não foi possível carregar suas adoções.'
          );
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregandoAdocoes(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

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

  const handleLogout = async () => {
    await usuariosService.logout();
    navigate('/');
  };

  const handleExcluirConta = async () => {
    setExcluindoConta(true);
    try {
      await usuariosService.excluir();
      navigate('/');
    } catch (e) {
      alert(e.message);
      setExcluindoConta(false);
    }
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
          <button className="btn btn--outline-gray" onClick={handleLogout}>← Sair</button>
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
                        onClick={() => navigate(`/animal/${fav.animal_id}`)}
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

        {/* Minhas adoções */}
        <section className="fav-panel">
          <div className="fav-panel__header">
            <h2 className="fav-panel__title">❤️ Minhas adoções</h2>

            {!carregandoAdocoes && !erroAdocoes && (
              <span className="badge-count-green">
                {adocoes.length} {adocoes.length === 1 ? 'adoção' : 'adoções'}
              </span>
            )}
          </div>

          {carregandoAdocoes ? (
            <p className="muted">Carregando suas adoções...</p>
          ) : erroAdocoes ? (
            <p role="alert">{erroAdocoes}</p>
          ) : adocoes.length === 0 ? (
            <p className="muted">
              Você ainda não possui adoções concluídas. Elas aparecerão aqui
              após o registro pelo administrador.
            </p>
          ) : (
            <div className="agend-list">
              {adocoes.map((adocao) => (
                <div key={adocao.id} className="agend-item">
                  <div className="agend-item__info">
                    <p className="agend-item__animal">
                      🐾 {adocao.nome_animal || 'Animal adotado'}
                    </p>

                    <p className="agend-item__date">
                      Adoção registrada em{' '}
                      {adocao.data_adocao
                        ? new Date(adocao.data_adocao).toLocaleDateString('pt-BR')
                        : 'data não informada'}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span className="status-badge status-badge--confirmado">
                      Adoção aprovada
                    </span>

                    <button
                      type="button"
                      className="btn btn--green"
                      onClick={() =>
                        navigate(
                          `/adocoes/${encodeURIComponent(adocao.id)}/acompanhamento`
                        )
                      }
                    >
                      Registrar acompanhamento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Zona de perigo: separada das ações comuns ── */}
        <section className="zona-perigo" aria-labelledby="zona-perigo-titulo">
          <div className="zona-perigo__cabecalho">
            <span className="zona-perigo__icone" aria-hidden="true">⚠️</span>
            <div>
              <h2 id="zona-perigo-titulo" className="zona-perigo__titulo">Zona de perigo</h2>
              <p className="zona-perigo__desc">
                Ações desta seção são <strong>permanentes</strong> e não podem ser desfeitas.
              </p>
            </div>
          </div>
          <div className="zona-perigo__acao">
            <div>
              <p className="zona-perigo__acao-titulo">Excluir minha conta</p>
              <p className="zona-perigo__acao-desc">
                Remove sua conta, seus favoritos e seus agendamentos.
              </p>
            </div>
            <button
              className="btn btn--outline-red"
              onClick={() => { setTextoConfirmacao(''); setExclusaoAberta(true); }}
            >
              Excluir conta…
            </button>
          </div>
        </section>
      </main>

      {exclusaoAberta && (
        <div className="account-modal__backdrop" onClick={() => !excluindoConta && setExclusaoAberta(false)}>
          <section
            className="account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="account-modal__icon" aria-hidden="true">!</div>
            <p className="account-modal__eyebrow">Atenção</p>
            <h2 id="account-modal-title" className="account-modal__title">Excluir sua conta?</h2>
            <p className="account-modal__description">
              Essa decisão é permanente. Ao confirmar, sua conta será encerrada e os dados associados serão removidos.
            </p>
            <div className="account-modal__impact">
              <span aria-hidden="true">✓</span>
              <p><strong>O que será removido:</strong> seus favoritos, agendamentos e dados de acesso.</p>
            </div>
            <label className="account-modal__confirmacao">
              <span>Para confirmar, digite <strong>{PALAVRA_CONFIRMACAO}</strong> no campo abaixo:</span>
              <input
                className="form-input"
                value={textoConfirmacao}
                onChange={(e) => setTextoConfirmacao(e.target.value)}
                placeholder={PALAVRA_CONFIRMACAO}
                autoFocus
                disabled={excluindoConta}
              />
            </label>
            <div className="account-modal__actions">
              <button
                type="button"
                className="btn btn--outline-gray"
                onClick={() => setExclusaoAberta(false)}
                disabled={excluindoConta}
              >
                Manter minha conta
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleExcluirConta}
                disabled={excluindoConta || textoConfirmacao.trim().toUpperCase() !== PALAVRA_CONFIRMACAO}
              >
                {excluindoConta ? 'Excluindo...' : 'Sim, excluir conta'}
              </button>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}
