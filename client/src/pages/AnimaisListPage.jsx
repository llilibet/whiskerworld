import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { animaisService } from '../services/animaisService';
import { favoritosService } from '../services/favoritosService';
import { getUsuarioLogado } from '../services/api';

const BASE = import.meta.env.VITE_API_URL || '';

const TIPO_CONFIG = {
  GATO: {
    emoji: '🐱',
    titulo: 'Gatos',
    subtitulo: 'Encontre seu companheiro felino perfeito',
    empty: 'Nenhum gato disponível',
    emptySub: 'No momento não temos gatos para adoção. Volte em breve!',
  },
  CAO: {
    emoji: '🐕',
    titulo: 'Cães',
    subtitulo: 'Encontre seu melhor amigo canino',
    empty: 'Nenhum cão disponível',
    emptySub: 'No momento não temos cães para adoção. Volte em breve!',
  },
};

export default function AnimaisListPage() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const tipoNorm = (tipo || 'GATO').toUpperCase();
  const config = TIPO_CONFIG[tipoNorm] || TIPO_CONFIG.GATO;
  const usuario = getUsuarioLogado();

  const [animais, setAnimais] = useState([]);
  const [favSet, setFavSet] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lista, favs] = await Promise.all([
        animaisService.listar(tipoNorm),
        usuario ? favoritosService.listar() : Promise.resolve([]),
      ]);
      setAnimais(lista || []);
      setFavSet(new Set((favs || []).map(f => f.animal_id)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [tipoNorm, usuario]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleFav = async (animalId) => {
    if (!usuario) { navigate('/login?tipo=ADOTANTE'); return; }
    try {
      if (favSet.has(animalId)) {
        await favoritosService.remover(animalId);
        setFavSet(s => { const n = new Set(s); n.delete(animalId); return n; });
      } else {
        await favoritosService.criar(animalId);
        setFavSet(s => new Set([...s, animalId]));
      }
    } catch (e) {
      console.error(e);
    }
  };

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

      <main className="animais-main">
        <div className="animais-header">
          <div className="animais-header__emoji">{config.emoji}</div>
          <h1 className="animais-header__title">{config.titulo}</h1>
          <p className="animais-header__sub">{config.subtitulo}</p>
          <span className="animais-header__badge">
            🐾 {animais.length} disponíve{animais.length === 1 ? 'l' : 'is'}
          </span>
        </div>

        {loading ? (
          <p className="muted" style={{ textAlign: 'center', marginTop: 40 }}>Carregando...</p>
        ) : animais.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__emoji">{config.emoji}</div>
            <h2 className="empty-state__title">{config.empty}</h2>
            <p className="empty-state__sub">{config.emptySub}</p>
          </div>
        ) : (
          <div className="animais-grid-adotante">
            {animais.map(animal => (
              <AnimalCardAdotante
                key={animal.id}
                animal={animal}
                isFav={favSet.has(animal.id)}
                onToggleFav={() => toggleFav(animal.id)}
                onAgendar={() => navigate(`/agendar/${animal.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AnimalCardAdotante({ animal, isFav, onToggleFav, onAgendar }) {
  const fotoSrc = animal.foto_url ? `${BASE}${animal.foto_url}` : null;

  return (
    <div className="aa-card">
      <div className="aa-card__photo-wrap">
        {fotoSrc
          ? <img className="aa-card__photo" src={fotoSrc} alt={animal.nome} />
          : <div className="aa-card__photo aa-card__photo--empty">🐾</div>
        }
        <span className="aa-card__disponivel">✓ DISPONÍVEL</span>
        <button
          className={`aa-card__heart${isFav ? ' aa-card__heart--active' : ''}`}
          onClick={onToggleFav}
          title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="aa-card__body">
        <p className="aa-card__name">
          {animal.tipo === 'GATO' ? '🐱' : '🐶'} {animal.nome}
        </p>
        <div className="aa-card__badges">
          {animal.idade && <span className="aa-badge">📅 {animal.idade}</span>}
          {animal.sexo  && <span className="aa-badge">🔹 {animal.sexo}</span>}
        </div>
        <div className="aa-card__btns">
          <button className="btn btn--xs btn--xs-outline" onClick={onToggleFav}>
            {isFav ? '❤️ Favoritado' : '🤍 Favoritar'}
          </button>
          <button className="btn btn--xs btn--green" onClick={onAgendar}>
            💚 Quero adotar
          </button>
        </div>
      </div>
    </div>
  );
}
