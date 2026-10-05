import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AnimalCard from '../components/AnimalCard';
import { useAnimaisAdmin } from '../hooks/useAnimais';
import { agendamentosService } from '../services/agendamentosService';
import { usuariosService } from '../services/usuariosService';
import { adocoesService } from '../services/adocoesService';

function formatDateTime(agendamento) {
  const dateStr = agendamento.data_visita;
  const timeStr = agendamento.hora_visita;

  if (!dateStr) return 'Data não informada';

  const parts = String(dateStr).split('T')[0].split('-');

  if (parts.length !== 3) return String(dateStr);

  const dataBR = `${parts[2]}/${parts[1]}/${parts[0]}`;
  const hora = timeStr ? String(timeStr).slice(0, 5) : null;

  return hora ? `${dataBR} • ${hora}` : dataBR;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const {
    animais,
    loading,
    carregar,
    deletar,
    porStatus,
  } = useAnimaisAdmin();

  const [agendamentos, setAgendamentos] = useState([]);
  const [carregandoAgendamentos, setCarregandoAgendamentos] =
    useState(true);
  const [erroAgendamentos, setErroAgendamentos] = useState('');
  const [concluindoAdocao, setConcluindoAdocao] = useState(false);

  // Derivado da lista para manter a contagem sempre atualizada.
  const pendentes = agendamentos.filter(
    (agendamento) => agendamento.status === 'PENDENTE'
  ).length;

  useEffect(() => {
    let ativo = true;

    agendamentosService.listarTodos()
      .then((data) => {
        if (ativo) {
          setAgendamentos(data || []);
        }
      })
      .catch((erro) => {
        if (ativo) {
          setErroAgendamentos(
            erro.message || 'Não foi possível carregar os agendamentos.'
          );
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregandoAgendamentos(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const handleDeletar = async (id) => {
    if (concluindoAdocao) return;

    if (!window.confirm('Confirma exclusão do animal?')) return;

    try {
      await deletar(id);
    } catch (erro) {
      alert('Erro: ' + erro.message);
    }
  };

  const handleEditar = (animal) => {
    navigate(`/admin/animal/${animal.id}`);
  };

  const handleStatusAgendamento = async (id, status) => {
    if (concluindoAdocao) return;

    try {
      await agendamentosService.atualizarStatus(id, status);

      setAgendamentos((anteriores) =>
        anteriores.map((agendamento) =>
          agendamento.id === id
            ? { ...agendamento, status }
            : agendamento
        )
      );
    } catch (erro) {
      alert('Erro: ' + erro.message);
    }
  };

  const handleConcluirAdocao = async (agendamento) => {
    if (concluindoAdocao) return;

    const nomeAdotante =
      agendamento.nome_usuario ||
      agendamento.email_usuario ||
      'este adotante';

    const confirmou = window.confirm(
      `Confirma que ${agendamento.nome_animal} foi adotado por ${nomeAdotante}? Essa ação registrará a adoção concluída.`
    );

    if (!confirmou) return;

    setConcluindoAdocao(true);

    try {
      const adocao = await adocoesService.concluir(agendamento.id);

      setAgendamentos((anteriores) =>
        anteriores.map((item) =>
          item.id === agendamento.id
            ? { ...item, adocao_id: adocao.id }
            : item
        )
      );

      // A adoção já foi salva. Uma falha de atualização do painel
      // não deve ser apresentada como falha ao concluir a adoção.
      try {
        await carregar();
      } catch {
        alert(
          'A adoção foi concluída, mas não foi possível atualizar a lista de animais. Atualize a página.'
        );
        return;
      }

      alert('Adoção concluída com sucesso!');
    } catch (erro) {
      alert('Erro: ' + erro.message);
    } finally {
      setConcluindoAdocao(false);
    }
  };

  const handleLogout = async () => {
    try {
      await usuariosService.logout();
      navigate('/');
    } catch (erro) {
      alert('Erro ao sair: ' + erro.message);
    }
  };

  const disponiveis = porStatus('DISPONIVEL');
  const emProcesso = porStatus('EM_PROCESSO');
  const adotados = porStatus('ADOTADO');

  return (
    <div
      className="page"
      style={{ background: '#edf7ed', minHeight: '100vh' }}
    >
      <Navbar variant="admin" />

      <main className="admin-main">
        {/* Header do painel */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">
              🛡️ Painel Administrativo
            </h1>
            <p className="admin-header__sub">
              Gerencie animais e agendamentos do abrigo
            </p>
          </div>

          <button
            type="button"
            className="btn btn--outline-gray"
            onClick={handleLogout}
            disabled={concluindoAdocao}
          >
            → Sair
          </button>
        </div>

        {/* Resumo */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-card__icon">🐾</span>
            <div>
              <div className="stat-card__value">
                {loading ? '…' : animais.length}
              </div>
              <div className="stat-card__label">
                Animais cadastrados
              </div>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-card__icon">📅</span>
            <div>
              <div className="stat-card__value">
                {carregandoAgendamentos ? '…' : agendamentos.length}
              </div>
              <div className="stat-card__label">Agendamentos</div>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-card__icon">⏳</span>
            <div>
              <div className="stat-card__value">
                {carregandoAgendamentos ? '…' : pendentes}
              </div>
              <div className="stat-card__label">Pendentes</div>
            </div>
          </div>
        </div>

        {/* Animais disponíveis */}
        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">✅ Animais Disponíveis</h2>

            <button
              type="button"
              className="btn btn--green"
              onClick={() => navigate('/admin/animal')}
              disabled={concluindoAdocao}
            >
              + Cadastrar novo
            </button>
          </div>

          {loading ? (
            <p className="muted">Carregando…</p>
          ) : disponiveis.length === 0 ? (
            <p className="muted">Nenhum animal disponível.</p>
          ) : (
            <div className="animals-grid">
              {disponiveis.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onEditar={handleEditar}
                  onDeletar={handleDeletar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Em processo de adoção */}
        <section className="panel">
          <h2 className="panel__title">⏳ Em Processo de Adoção</h2>

          {loading ? (
            <p className="muted">Carregando…</p>
          ) : emProcesso.length === 0 ? (
            <p className="muted">Nenhum animal em processo.</p>
          ) : (
            <div className="animals-grid">
              {emProcesso.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onEditar={handleEditar}
                  onDeletar={handleDeletar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Adotados */}
        <section className="panel">
          <h2 className="panel__title">❤️ Adotados</h2>

          {loading ? (
            <p className="muted">Carregando…</p>
          ) : adotados.length === 0 ? (
            <p className="muted">Nenhum animal adotado ainda.</p>
          ) : (
            <div className="animals-grid">
              {adotados.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onEditar={handleEditar}
                  onDeletar={handleDeletar}
                />
              ))}
            </div>
          )}
        </section>

        {/* Agendamentos */}
        <section className="panel">
          <h2 className="panel__title">📋 Agendamentos</h2>

          {carregandoAgendamentos ? (
            <p className="muted">Carregando agendamentos…</p>
          ) : erroAgendamentos ? (
            <p role="alert">{erroAgendamentos}</p>
          ) : agendamentos.length === 0 ? (
            <p className="muted">Nenhum agendamento.</p>
          ) : (
            <div className="agendamentos-list">
              {agendamentos.map((ag) => {
                const animal = animais.find(
                  (item) => item.id === ag.animal_id
                );

                const podeConcluir =
                  !loading &&
                  ag.status === 'CONFIRMADO' &&
                  !ag.adocao_id &&
                  Boolean(animal) &&
                  animal.status !== 'ADOTADO';

                return (
                  <div key={ag.id} className="agendamento-item">
                    <div className="agendamento-item__left">
                      <div className="agendamento-item__user">
                        👤{' '}
                        {ag.nome_usuario ||
                          ag.email_usuario ||
                          `Usuário #${ag.usuario_id}`}
                      </div>

                      <div className="agendamento-item__info">
                        🐾 {ag.nome_animal}
                        &nbsp;•&nbsp;
                        📅 {formatDateTime(ag)}
                      </div>
                    </div>

                    <div className="agendamento-item__right">
                      <span
                        className={`status-badge status-badge--${(
                          ag.status || ''
                        ).toLowerCase()}`}
                      >
                        {ag.status === 'CONFIRMADO'
                          ? '✔ CONFIRMADO'
                          : ag.status === 'CANCELADO'
                            ? '✖ CANCELADO'
                            : '⏳ ' + (ag.status || 'Não informado')}
                      </span>

                      {ag.status === 'PENDENTE' && !ag.adocao_id && (
                        <div className="agendamento-item__btns">
                          <button
                            type="button"
                            className="btn-icon btn-icon--confirm"
                            onClick={() =>
                              handleStatusAgendamento(ag.id, 'CONFIRMADO')
                            }
                            title="Confirmar"
                            aria-label={`Confirmar agendamento de ${ag.nome_usuario || ag.email_usuario || 'usuário'} para ${ag.nome_animal}`}
                            disabled={concluindoAdocao}
                          >
                            <span aria-hidden="true">✔</span>
                          </button>

                          <button
                            type="button"
                            className="btn-icon btn-icon--cancel"
                            onClick={() =>
                              handleStatusAgendamento(ag.id, 'CANCELADO')
                            }
                            title="Cancelar"
                            aria-label={`Cancelar agendamento de ${ag.nome_usuario || ag.email_usuario || 'usuário'} para ${ag.nome_animal}`}
                            disabled={concluindoAdocao}
                          >
                            <span aria-hidden="true">✖</span>
                          </button>
                        </div>
                      )}

                      {ag.adocao_id ? (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <span className="status-badge">
                            Adoção concluída
                          </span>

                          <button
                            type="button"
                            className="btn btn--outline"
                            onClick={() =>
                              navigate(
                                `/admin/adocoes/${encodeURIComponent(ag.adocao_id)}/acompanhamento`
                              )
                            }
                          >
                            Ver acompanhamentos
                          </button>
                        </div>
                      ) : podeConcluir ? (
                        <button
                          type="button"
                          className="btn btn--green"
                          disabled={concluindoAdocao}
                          onClick={() => handleConcluirAdocao(ag)}
                        >
                          {concluindoAdocao
                            ? 'Aguarde...'
                            : 'Concluir adoção'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}