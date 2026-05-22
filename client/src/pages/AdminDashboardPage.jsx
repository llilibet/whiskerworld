import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimalCard from '../components/AnimalCard';
import { useAnimaisAdmin } from '../hooks/useAnimais';
import { agendamentosService } from '../services/agendamentosService';
import { usuariosService } from '../services/usuariosService';

function formatDateTime(a) {
  const dateStr = a.data_visita;
  const timeStr = a.hora_visita;
  if (!dateStr) return 'Data não informada';
  try {
    const parts = String(dateStr).split('T')[0].split('-');
    const dataBR = `${parts[2]}/${parts[1]}/${parts[0]}`;
    const hora = timeStr ? String(timeStr).slice(0, 5) : null;
    return hora ? `${dataBR} • ${hora}` : dataBR;
  } catch {
    return String(dateStr);
  }
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { animais, loading, carregar, deletar, porStatus } = useAnimaisAdmin();
  const [agendamentos, setAgendamentos] = useState([]);
  const [pendentes, setPendentes] = useState(0);

  useEffect(() => {
    agendamentosService.listarTodos()
      .then((data) => {
        setAgendamentos(data || []);
        setPendentes((data || []).filter((a) => a.status === 'PENDENTE').length);
      })
      .catch(console.error);
  }, []);

  const handleDeletar = async (id) => {
    if (!confirm('Confirma exclusão do animal?')) return;
    try { await deletar(id); } catch (e) { alert('Erro: ' + e.message); }
  };

  const handleEditar = (animal) => navigate(`/admin/animal/${animal.id}`);

  const handleStatusAgendamento = async (id, status) => {
    try {
      await agendamentosService.atualizarStatus(id, status);
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      setPendentes((prev) => (status !== 'PENDENTE' ? Math.max(0, prev - 1) : prev));
    } catch (e) { alert('Erro: ' + e.message); }
  };

  const handleLogout = () => { usuariosService.logout(); navigate('/'); };

  const disponiveis = porStatus('DISPONIVEL');
  const emProcesso = porStatus('EM_PROCESSO');
  const adotados = porStatus('ADOTADO');

  return (
    <div className="page">
      <Navbar variant="admin" />

      <main className="admin-main">
        {/* ── Header do painel ── */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">🛡️ Painel Administrativo</h1>
            <p className="admin-header__sub">Gerencie animais e agendamentos do abrigo</p>
          </div>
          <button className="btn btn--outline-red" onClick={handleLogout}>
            → Sair
          </button>
        </div>

        {/* ── Resumo ── */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-card__icon">🐾</span>
            <div>
              <div className="stat-card__value">{loading ? '…' : animais.length}</div>
              <div className="stat-card__label">Animais cadastrados</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">📅</span>
            <div>
              <div className="stat-card__value">{agendamentos.length}</div>
              <div className="stat-card__label">Agendamentos</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">⏳</span>
            <div>
              <div className="stat-card__value">{pendentes}</div>
              <div className="stat-card__label">Pendentes</div>
            </div>
          </div>
        </div>

        {/* ── Animais Disponíveis ── */}
        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">✅ Animais Disponíveis</h2>
            <button className="btn btn--green" onClick={() => navigate('/admin/animal')}>
              + Cadastrar novo
            </button>
          </div>
          {loading ? (
            <p className="muted">Carregando…</p>
          ) : disponiveis.length === 0 ? (
            <p className="muted">Nenhum animal disponível.</p>
          ) : (
            <div className="animals-grid">
              {disponiveis.map((a) => (
                <AnimalCard key={a.id} animal={a} onEditar={handleEditar} onDeletar={handleDeletar} />
              ))}
            </div>
          )}
        </section>

        {/* ── Em Processo de Adoção ── */}
        <section className="panel">
          <h2 className="panel__title">⏳ Em Processo de Adoção</h2>
          {emProcesso.length === 0 ? (
            <p className="muted">Nenhum animal em processo.</p>
          ) : (
            <div className="animals-grid">
              {emProcesso.map((a) => (
                <AnimalCard key={a.id} animal={a} onEditar={handleEditar} onDeletar={handleDeletar} />
              ))}
            </div>
          )}
        </section>

        {/* ── Adotados ── */}
        <section className="panel">
          <h2 className="panel__title">❤️ Adotados</h2>
          {adotados.length === 0 ? (
            <p className="muted">Nenhum animal adotado ainda.</p>
          ) : (
            <div className="animals-grid">
              {adotados.map((a) => (
                <AnimalCard key={a.id} animal={a} onEditar={handleEditar} onDeletar={handleDeletar} />
              ))}
            </div>
          )}
        </section>

        {/* ── Agendamentos ── */}
        <section className="panel">
          <h2 className="panel__title">📋 Agendamentos</h2>
          {agendamentos.length === 0 ? (
            <p className="muted">Nenhum agendamento.</p>
          ) : (
            <div className="agendamentos-list">
              {agendamentos.map((ag) => (
                <div key={ag.id} className="agendamento-item">
                  <div className="agendamento-item__left">
                    <div className="agendamento-item__user">
                      👤 {ag.nome_usuario || ag.email_usuario || `Usuário #${ag.usuario_id}`}
                    </div>
                    <div className="agendamento-item__info">
                      🐾 {ag.nome_animal} &nbsp;•&nbsp; 📅 {formatDateTime(ag)}
                    </div>
                  </div>
                  <div className="agendamento-item__right">
                    <span className={`status-badge status-badge--${(ag.status || '').toLowerCase()}`}>
                      {ag.status === 'CONFIRMADO' ? '✔ CONFIRMADO' : ag.status === 'CANCELADO' ? '✖ CANCELADO' : '⏳ ' + ag.status}
                    </span>
                    {ag.status === 'PENDENTE' && (
                      <div className="agendamento-item__btns">
                        <button className="btn-icon btn-icon--confirm" onClick={() => handleStatusAgendamento(ag.id, 'CONFIRMADO')} title="Confirmar">✔</button>
                        <button className="btn-icon btn-icon--cancel" onClick={() => handleStatusAgendamento(ag.id, 'CANCELADO')} title="Cancelar">✖</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
