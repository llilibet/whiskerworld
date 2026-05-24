import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { animaisService } from '../services/animaisService';

const BASE = import.meta.env.VITE_API_URL || '';

export default function AnimalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animaisService.obterPorId(id)
      .then(data => setAnimal(data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const emoji = animal?.tipo === 'CAO' ? '🐶' : '🐱';

  return (
    <div className="animais-page">
      {/* Navbar */}
      <nav className="navbar navbar--adotante">
        <div className="navbar__logo">
          <img src="/logo.png" alt="Whiskerworld" className="navbar__logo-img" />
        </div>
        <button className="btn btn--outline-white" onClick={() => navigate(-1)}>← Voltar</button>
      </nav>

      <main style={{ maxWidth: 600, margin: '0 auto', padding: '32px 16px' }}>
        {loading ? (
          <p className="muted" style={{ textAlign: 'center', marginTop: 60 }}>Carregando...</p>
        ) : !animal ? (
          <p className="muted" style={{ textAlign: 'center', marginTop: 60 }}>Animal não encontrado.</p>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}>
            {/* Foto */}
            <div style={{ position: 'relative', background: '#f0f9f0', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {animal.foto_url
                ? <img
                    src={`${BASE}${animal.foto_url}`}
                    alt={animal.nome}
                    style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }}
                  />
                : <span style={{ fontSize: 100 }}>{emoji}</span>
              }
              <span style={{
                position: 'absolute', top: 12, right: 12,
                background: '#4caf50', color: '#fff',
                borderRadius: 20, padding: '4px 12px',
                fontSize: 12, fontWeight: 700,
              }}>✓ DISPONÍVEL</span>
            </div>

            {/* Info */}
            <div style={{ padding: '24px 28px' }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e2d1a', marginBottom: 12 }}>
                {emoji} {animal.nome}
              </h1>

              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                <span className="aa-badge">📌 {animal.tipo === 'CAO' ? 'Cão' : 'Gato'}</span>
                {animal.idade && <span className="aa-badge">📅 {animal.idade}</span>}
                {animal.sexo  && <span className="aa-badge">{animal.sexo === 'MACHO' ? '♂' : '♀'} {animal.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}</span>}
                {animal.porte && <span className="aa-badge">📐 {animal.porte.charAt(0) + animal.porte.slice(1).toLowerCase()}</span>}
                {animal.raca  && <span className="aa-badge">🧬 {animal.raca}</span>}
                {animal.vacinado ? <span className="aa-badge" style={{ background: '#e8f5e9', color: '#2e7d32' }}>✔ Vacinado</span> : <span className="aa-badge" style={{ background: '#fce4ec', color: '#c62828' }}>✗ Não vacinado</span>}
              </div>

              {/* Descrição */}
              {animal.descricao && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#6b7c63', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Sobre</p>
                  <p style={{ color: '#3a3a3a', lineHeight: 1.7, fontSize: 15 }}>{animal.descricao}</p>
                </div>
              )}

              {/* Histórico */}
              {animal.historico && (
                <div style={{ marginBottom: 24, background: '#f8faf6', borderRadius: 10, padding: '16px 18px', borderLeft: '4px solid #4caf50' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#4caf50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📂 Histórico do Pet</p>
                  <p style={{ color: '#3a3a3a', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>{animal.historico}</p>
                </div>
              )}

              {/* Botões */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="btn btn--green"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/agendar/${animal.id}`)}
                >
                  📅 Quero adotar
                </button>
                <button
                  className="btn btn--outline"
                  style={{ flex: 1 }}
                  onClick={() => navigate(-1)}
                >
                  ← Voltar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
