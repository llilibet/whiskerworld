import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { animaisService } from '../services/animaisService';
import { agendamentosService } from '../services/agendamentosService';
import { getUsuarioLogado } from '../services/api';
import { assetUrl } from '../services/assets';

const HORARIOS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

// Minimum date = tomorrow, max = 60 days from today (Mon–Sat)
function todayStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
function maxDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split('T')[0];
}

export default function AgendarVisitaPage() {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const [animal, setAnimal] = useState(null);
  const [loadingAnimal, setLoadingAnimal] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState(null);

  const [nome, setNome] = useState(usuario?.nome || '');
  const [dataVisita, setDataVisita] = useState('');
  const [horaVisita, setHoraVisita] = useState('08:00');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    animaisService.obterPorId(animalId)
      .then(data => setAnimal(data || null))
      .catch(console.error)
      .finally(() => setLoadingAnimal(false));
  }, [animalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErro(null);
    try {
      await agendamentosService.criar({
        animal_id: Number(animalId),
        data_visita: dataVisita,
        hora_visita: horaVisita,
        observacoes: observacoes || undefined,
      });
      setSucesso(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (sucesso) {
    return (
      <div className="animais-page">
        <nav className="navbar navbar--adotante">
          <div className="navbar__logo">
            <span className="navbar__paw">🐾</span>
            <span className="navbar__brand" style={{ color: '#fff' }}>Whiskerworld</span>
          </div>
          <button className="btn btn--outline-white" onClick={() => navigate('/dashboard')}>← Voltar</button>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1e2d1a', marginBottom: 10 }}>
            Visita agendada com sucesso!
          </h2>
          <p style={{ color: '#6b7c63', marginBottom: 28 }}>
            Sua visita para conhecer <strong>{animal?.nome}</strong> foi solicitada.<br />
            Aguarde a confirmação em Meus Agendamentos.
          </p>
          <button className="btn btn--green" onClick={() => navigate('/dashboard')}>
            Ir para Minha Área
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animais-page">
      {/* ── Navbar ── */}
      <nav className="navbar navbar--adotante">
        <div className="navbar__logo">
          <span className="navbar__paw">🐾</span>
          <span className="navbar__brand" style={{ color: '#fff' }}>Whiskerworld</span>
        </div>
        <button className="btn btn--outline-white" onClick={() => navigate(-1)}>← Voltar</button>
      </nav>

      <main className="agendar-main">
        <div className="agendar-header">
          <div className="agendar-header__emoji">📅</div>
          <h1 className="agendar-header__title">Agendar Visita</h1>
          <p className="agendar-header__sub">Marque uma visita para conhecer seu futuro pet</p>
        </div>

        {/* Animal info card */}
        {!loadingAnimal && animal && (
          <div className="animal-info-card">
            {animal.foto_url
              ? <img className="animal-info-card__photo" src={assetUrl(animal.foto_url)} alt={animal.nome} />
              : <div className="animal-info-card__photo animal-info-card__photo--placeholder">
                  {animal.tipo === 'GATO' ? '🐱' : '🐶'}
                </div>
            }
            <div>
              <h2 className="animal-info-card__name">
                {animal.tipo === 'GATO' ? '🐱' : '🐶'} {animal.nome}
              </h2>
              <div className="animal-info-card__badges">
                <span className="aa-badge">📌 {animal.tipo}</span>
                {animal.idade && <span className="aa-badge">📅 {animal.idade}</span>}
                {animal.sexo  && <span className="aa-badge">🔹 {animal.sexo?.toUpperCase()}</span>}
                {animal.vacinado && <span className="aa-badge">✔ Vacinado</span>}
              </div>
              <p className="animal-info-card__id">ID: {animal.id}</p>
            </div>
          </div>
        )}

        <div className="agendar-hint">
          ✅ Preencha os dados abaixo para solicitar sua visita
        </div>

        <form onSubmit={handleSubmit}>
          {/* Seus dados */}
          <div className="agendar-form-card">
            <h3 className="agendar-section-title">👤 Seus Dados</h3>
            <div className="form-group">
              <label className="form-label">👤 Nome completo</label>
              <input
                className="form-input"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          {/* Data e Horário */}
          <div className="agendar-form-card">
            <h3 className="agendar-section-title">📅 Data e Horário</h3>
            <div className="agendar-date-row">
              <div className="form-group">
                <label className="form-label">📅 Data da visita</label>
                <input
                  className="form-input"
                  type="date"
                  value={dataVisita}
                  min={todayStr()}
                  max={maxDateStr()}
                  onChange={e => setDataVisita(e.target.value)}
                  required
                />
                <p className="form-hint">📌 Segunda a Sábado (Domingo não disponível)</p>
              </div>
              <div className="form-group">
                <label className="form-label">🕐 Horário</label>
                <select
                  className="form-select"
                  value={horaVisita}
                  onChange={e => setHoraVisita(e.target.value)}
                  required
                >
                  {HORARIOS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <p className="form-hint">🌅 Manhã: 08h–11h | Tarde: 13h–17h</p>
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="agendar-form-card">
            <h3 className="agendar-section-title">💬 Informação Adicional</h3>
            <div className="form-group">
              <label className="form-label">Observações (opcional)</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
                placeholder="Alguma dúvida ou comentário?"
              />
            </div>
          </div>

          {erro && (
            <div className="alert alert--error" style={{ marginBottom: 16 }}>{erro}</div>
          )}

          <button
            className="btn btn--green btn--full"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Agendando...' : '📅 Confirmar Agendamento'}
          </button>
        </form>
      </main>
    </div>
  );
}
