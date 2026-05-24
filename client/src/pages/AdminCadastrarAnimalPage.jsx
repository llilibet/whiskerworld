import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { animaisService } from '../services/animaisService';

const BASE = import.meta.env.VITE_API_URL || '';

export default function AdminCadastrarAnimalPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = Boolean(id);

  const [form, setForm] = useState({
    nome: '', idadeNum: '', idadeUnidade: 'meses', sexo: '', tipo: '', raca: '', porte: '', vacinado: '0', status: 'DISPONIVEL', descricao: '', historico: '',
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isEdicao) {
      animaisService.obterPorId(id).then((animal) => {
        setForm({
          nome: animal.nome || '',
          idadeNum: animal.idade ? animal.idade.split(' ')[0] : '',
          idadeUnidade: animal.idade && animal.idade.includes('ano') ? 'anos' : 'meses',
          sexo: animal.sexo || '',
          tipo: animal.tipo || '',
          raca: animal.raca || '',
          porte: animal.porte || '',
          vacinado: animal.vacinado ? '1' : '0',
          status: animal.status || 'DISPONIVEL',
          descricao: animal.descricao || '',
          historico: animal.historico || '',
        });
        if (animal.foto_url) setPreviewUrl(`${BASE}${animal.foto_url}`);
      }).catch((e) => setErro(e.message));
    }
  }, [id, isEdicao]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    // Validação client-side dos campos obrigatórios
    if (!form.idadeNum) { setErro('Idade aproximada é obrigatória.'); setLoading(false); return; }
    if (!form.porte)    { setErro('Porte é obrigatório.'); setLoading(false); return; }
    if (!form.descricao.trim()) { setErro('Descrição é obrigatória.'); setLoading(false); return; }
    if (!form.historico.trim()) { setErro('Histórico do pet é obrigatório.'); setLoading(false); return; }
    if (!isEdicao && !fotoFile) { setErro('Foto é obrigatória para publicar o pet.'); setLoading(false); return; }

    try {
      const fd = new FormData();
      const { idadeNum, idadeUnidade, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      if (idadeNum) fd.append('idade', `${idadeNum} ${idadeUnidade}`);
      if (fotoFile) fd.append('foto', fotoFile);

      if (isEdicao) {
        await animaisService.atualizar(id, fd);
      } else {
        await animaisService.criar(fd);
      }
      navigate('/admin');
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar variant="admin" />

      <main className="form-main">
        <div className="form-card">
          <div className="form-card__icon">🐾</div>
          <h1 className="form-card__title">
            {isEdicao ? 'Editar Animal' : 'Cadastrar Novo Animal'}
          </h1>
          <p className="form-card__subtitle">
            Preencha os dados do pet para disponibilizá-lo para adoção
          </p>

          {erro && <div className="alert alert--error">{erro}</div>}

          <form onSubmit={handleSubmit}>
            {/* ── Informações Básicas ── */}
            <div className="form-section">
              <h2 className="form-section__title">📋 Informações Básicas</h2>

              <div className="form-group">
                <label className="form-label">🏷️ Nome do Animal</label>
                <input
                  className="form-input"
                  name="nome"
                  placeholder="Ex: Luna, Thor, Mel..."
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">📅 Idade</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="form-input"
                      name="idadeNum"
                      type="number"
                      min="0"
                      placeholder="Ex: 3"
                      value={form.idadeNum}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                      required
                    />
                    <select
                      className="form-select"
                      name="idadeUnidade"
                      value={form.idadeUnidade}
                      onChange={handleChange}
                      style={{ flex: 1 }}
                    >
                      <option value="meses">Meses</option>
                      <option value="anos">Anos</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">⚧ Sexo</label>
                  <select className="form-select" name="sexo" value={form.sexo} onChange={handleChange} required>
                    <option value="">Selecione o sexo</option>
                    <option value="MACHO">Macho</option>
                    <option value="FEMEA">Fêmea</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">🐾 Tipo de Animal</label>
                  <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange} required>
                    <option value="">Selecione o tipo</option>
                    <option value="GATO">Gato</option>
                    <option value="CAO">Cão</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">� Porte</label>
                  <select className="form-select" name="porte" value={form.porte} onChange={handleChange} required>
                    <option value="">Selecione o porte</option>
                    <option value="PEQUENO">Pequeno</option>
                    <option value="MEDIO">Médio</option>
                    <option value="GRANDE">Grande</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">🧬 Raça</label>
                  <input
                    className="form-input"
                    name="raca"
                    placeholder="Ex: Labrador, Siamês, SRD..."
                    value={form.raca}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">💉 Vacinado?</label>
                  <select className="form-select" name="vacinado" value={form.vacinado} onChange={handleChange}>
                    <option value="0">❌ Não</option>
                    <option value="1">✅ Sim</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">📊 Status</label>
                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="DISPONIVEL">✅ Disponível</option>
                  <option value="EM_PROCESSO">⏳ Em Processo de Adoção</option>
                  <option value="ADOTADO">❤️ Adotado</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">📝 Descrição</label>
                <textarea
                  className="form-textarea"
                  name="descricao"
                  rows={4}
                  placeholder="Conte um pouco sobre a personalidade do pet, comportamento, se dá bem com outros animais..."
                  value={form.descricao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">📂 Histórico do Pet</label>
                <textarea
                  className="form-textarea"
                  name="historico"
                  rows={4}
                  placeholder="Registre informações de saúde, resgates, tratamentos realizados..."
                  value={form.historico}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ── Foto ── */}
            <div className="form-section">
              <h2 className="form-section__title">📷 Foto do Animal</h2>
              <div className="foto-upload-row">
                <div className="foto-upload-zone" onClick={() => fileInputRef.current?.click()}>
                  <span className="foto-upload-zone__icon">📁</span>
                  <span className="foto-upload-zone__text">Clique para escolher arquivo</span>
                  <span className="foto-upload-zone__hint">JPG, PNG ou WEBP (máx. 5MB)</span>
                  {isEdicao && (
                    <span className="foto-upload-zone__hint">ℹ️ Ao editar, deixe em branco para manter a foto atual.</span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="foto-upload-zone__input"
                    onChange={handleFoto}
                  />
                </div>
                <div className="foto-preview">
                  <span className="foto-preview__label">Preview</span>
                  {previewUrl ? (
                    <img className="foto-preview__img" src={previewUrl} alt="Preview" />
                  ) : (
                    <div className="foto-preview__placeholder">?</div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Botões ── */}
            <div className="form-actions">
              <button type="button" className="btn btn--outline-gray" onClick={() => navigate('/admin')}>
                ✕ Cancelar
              </button>
              <button type="submit" className="btn btn--green" disabled={loading}>
                {loading ? 'Salvando…' : isEdicao ? '✔ Salvar Alterações' : '✔ Cadastrar Animal'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
