import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { animaisService } from '../services/animaisService';
import { agendamentosService } from '../services/agendamentosService';
import { getUsuarioLogado } from '../services/api';

const BASE = import.meta.env.VITE_API_URL || '';

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
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [idadeAdotante, setIdadeAdotante] = useState('');

  // Residência
  const [tipoMoradia, setTipoMoradia] = useState('CASA');
  const [moradiaPropria, setMoradiaPropria] = useState('PROPRIA');
  const [temEspacoExterno, setTemEspacoExterno] = useState('NAO');
  const [tamanhoMoradia, setTamanhoMoradia] = useState('MEDIO');

  // Rotina
  const [horasSozinho, setHorasSozinho] = useState('4');
  const [temOutrosPets, setTemOutrosPets] = useState('NAO');
  const [temCriancas, setTemCriancas] = useState('NAO');
  const [descricaoRotina, setDescricaoRotina] = useState('');

  // Condições de cuidado
  const [experienciaPets, setExperienciaPets] = useState('POUCA');
  const [temAcessoVeterinario, setTemAcessoVeterinario] = useState('SIM');
  const [motivoAdocao, setMotivoAdocao] = useState('');

  const [dataVisita, setDataVisita] = useState('');
  const [horaVisita, setHoraVisita] = useState('08:00');
  const [observacoes, setObservacoes] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    if (!dataVisita) { setHorariosOcupados([]); return; }
    setLoadingHorarios(true);
    agendamentosService.obterHorariosOcupados(dataVisita)
      .then(lista => {
        setHorariosOcupados(lista || []);
        // Se o horário atualmente selecionado ficou ocupado, mover para o primeiro livre
        if ((lista || []).includes(horaVisita)) {
          const livre = HORARIOS.find(h => !lista.includes(h));
          if (livre) setHoraVisita(livre);
        }
      })
      .catch(() => setHorariosOcupados([]))
      .finally(() => setLoadingHorarios(false));
  }, [dataVisita]);

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
        animal_id: animalId,
        data_visita: dataVisita,
        hora_visita: horaVisita,
        observacoes: observacoes || undefined,
        // dados pessoais
        telefone,
        cpf,
        idade_adotante: idadeAdotante,
        // residência
        tipo_moradia: tipoMoradia,
        moradia_propria: moradiaPropria,
        tem_espaco_externo: temEspacoExterno,
        tamanho_moradia: tamanhoMoradia,
        // rotina
        horas_sozinho: horasSozinho,
        tem_outros_pets: temOutrosPets,
        tem_criancas: temCriancas,
        descricao_rotina: descricaoRotina || undefined,
        // condições de cuidado
        experiencia_pets: experienciaPets,
        tem_acesso_veterinario: temAcessoVeterinario,
        motivo_adocao: motivoAdocao || undefined,
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
              ? <img className="animal-info-card__photo" src={`${BASE}${animal.foto_url}`} alt={animal.nome} />
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
            <div className="agendar-date-row">
              <div className="form-group">
                <label className="form-label">📱 Telefone</label>
                <input
                  className="form-input"
                  type="tel"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">🆔 CPF</label>
                <input
                  className="form-input"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">🎂 Sua idade</label>
              <input
                className="form-input"
                type="number"
                min="18"
                max="120"
                value={idadeAdotante}
                onChange={e => setIdadeAdotante(e.target.value)}
                placeholder="Ex: 30"
                required
              />
            </div>
          </div>

          {/* Residência */}
          <div className="agendar-form-card">
            <h3 className="agendar-section-title">🏠 Residência</h3>
            <div className="agendar-date-row">
              <div className="form-group">
                <label className="form-label">Tipo de moradia</label>
                <select className="form-select" value={tipoMoradia} onChange={e => setTipoMoradia(e.target.value)}>
                  <option value="CASA">Casa</option>
                  <option value="APARTAMENTO">Apartamento</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Situação</label>
                <select className="form-select" value={moradiaPropria} onChange={e => setMoradiaPropria(e.target.value)}>
                  <option value="PROPRIA">Própria</option>
                  <option value="ALUGADA">Alugada</option>
                </select>
              </div>
            </div>
            <div className="agendar-date-row">
              <div className="form-group">
                <label className="form-label">Tamanho da moradia</label>
                <select className="form-select" value={tamanhoMoradia} onChange={e => setTamanhoMoradia(e.target.value)}>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tem espaço externo?</label>
                <select className="form-select" value={temEspacoExterno} onChange={e => setTemEspacoExterno(e.target.value)}>
                  <option value="SIM">Sim (quintal / área)</option>
                  <option value="NAO">Não</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rotina */}
          <div className="agendar-form-card">
            <h3 className="agendar-section-title">⏰ Rotina</h3>
            <div className="agendar-date-row">
              <div className="form-group">
                <label className="form-label">Horas que o pet ficaria sozinho por dia</label>
                <select className="form-select" value={horasSozinho} onChange={e => setHorasSozinho(e.target.value)}>
                  {['0','1','2','3','4','5','6','7','8','9','10','11','12'].map(h => (
                    <option key={h} value={h}>{h}h</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Já tem outros pets?</label>
                <select className="form-select" value={temOutrosPets} onChange={e => setTemOutrosPets(e.target.value)}>
                  <option value="NAO">Não</option>
                  <option value="SIM">Sim</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Tem crianças em casa?</label>
              <select className="form-select" value={temCriancas} onChange={e => setTemCriancas(e.target.value)}>
                <option value="NAO">Não</option>
                <option value="SIM">Sim</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Descreva sua rotina diária (opcional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={descricaoRotina}
                onChange={e => setDescricaoRotina(e.target.value)}
                placeholder="Ex: trabalho fora 8h por dia, tenho familiares que ficam em casa..."
              />
            </div>
          </div>

          {/* Condições de cuidado */}
          <div className="agendar-form-card">
            <h3 className="agendar-section-title">💚 Condições de Cuidado</h3>
            <div className="agendar-date-row">
              <div className="form-group">
                <label className="form-label">Experiência com pets</label>
                <select className="form-select" value={experienciaPets} onChange={e => setExperienciaPets(e.target.value)}>
                  <option value="NENHUMA">Nenhuma</option>
                  <option value="POUCA">Pouca</option>
                  <option value="MUITA">Muita</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tem acesso a veterinário?</label>
                <select className="form-select" value={temAcessoVeterinario} onChange={e => setTemAcessoVeterinario(e.target.value)}>
                  <option value="SIM">Sim</option>
                  <option value="NAO">Não</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Por que deseja adotar? (opcional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={motivoAdocao}
                onChange={e => setMotivoAdocao(e.target.value)}
                placeholder="Conte-nos um pouco sobre sua motivação..."
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
                  disabled={!dataVisita || loadingHorarios}
                >
                  {HORARIOS.map(h => (
                    <option key={h} value={h} disabled={horariosOcupados.includes(h)}>
                      {h}{horariosOcupados.includes(h) ? ' — Indisponível' : ''}
                    </option>
                  ))}
                </select>
                <p className="form-hint">
                  {loadingHorarios ? 'Verificando disponibilidade...' : '🌅 Manhã: 08h–11h | Tarde: 13h–17h'}
                </p>
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

          {/* Informações importantes */}
          <div style={{
            background: '#f0f9f0',
            border: '1px solid #c8e6c9',
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 20,
          }}>
            <p style={{ fontWeight: 700, color: '#4a7c4e', marginBottom: 8 }}>
              💡 Informações importantes
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#4a6a4e', fontSize: 14, lineHeight: '1.8' }}>
              <li>O agendamento ficará com status <strong>Pendente</strong> até confirmação do abrigo</li>
              <li>Você receberá uma confirmação após a análise</li>
              <li>Traga um documento de identificação no dia da visita</li>
            </ul>
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
