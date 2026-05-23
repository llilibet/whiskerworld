import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function EscolhaAnimalPage() {
  const navigate = useNavigate();

  return (
    <div className="escolha-page">
      <Navbar variant="adotante-nav" />

      <main className="escolha-main">
        {/* decorative floating icons */}
        <div className="escolha-main__deco" aria-hidden="true">
          <span style={{ top: '8%',   left: '5%'  }}>🐾</span>
          <span style={{ top: '20%',  right: '8%' }}>💕</span>
          <span style={{ bottom: '20%', left: '8%' }}>🐾</span>
          <span style={{ bottom: '30%', right: '5%' }}>🐶</span>
          <span style={{ top: '50%',  left: '3%'  }}>🐱</span>
          <span style={{ top: '40%',  right: '4%' }}>🐾</span>
        </div>

        <span className="escolha-badge">🐾 Adoção Responsável</span>
        <h1 className="escolha-title">O que você procura? 🤔</h1>
        <p className="escolha-subtitle">Escolha o tipo de pet que deseja conhecer</p>

        <div className="pet-type-cards">
          {/* Gatos */}
          <div className="pet-type-card" onClick={() => navigate('/animais/GATO')}>
            <div className="pet-type-card__avatar">
              <img
                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop"
                alt="Gato"
              />
            </div>
            <div className="pet-type-card__emoji">🐱</div>
            <h3 className="pet-type-card__title">Gatos</h3>
            <p className="pet-type-card__desc">
              Felinos independentes, carinhosos e cheios de personalidade
            </p>
            <button className="btn btn--orange btn--full">🐱 Ver Gatos</button>
          </div>

          {/* Cães */}
          <div className="pet-type-card" onClick={() => navigate('/animais/CAO')}>
            <div className="pet-type-card__avatar">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop"
                alt="Cão"
              />
            </div>
            <div className="pet-type-card__emoji">🐶</div>
            <h3 className="pet-type-card__title">Cães</h3>
            <p className="pet-type-card__desc">
              Companheiros fiéis, brincalhões e sempre prontos para te amar
            </p>
            <button className="btn btn--blue btn--full">🐾 Ver Cães</button>
          </div>
        </div>

        <Link to="/dashboard" className="escolha-back">← Voltar ao início</Link>
      </main>
    </div>
  );
}
