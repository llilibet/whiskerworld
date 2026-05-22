import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FEATURES = [
  { emoji: '🔍', title: 'Busca Fácil', desc: 'Encontre o pet ideal filtrando por espécie, idade e características. Navegação simples e intuitiva.' },
  { emoji: '📅', title: 'Agendamento Online', desc: 'Agende visitas diretamente pela plataforma. Escolha a data e horário mais convenientes para você.' },
  { emoji: '💉', title: 'Pets Vacinados', desc: 'Todos os animais passam por cuidados veterinários e estão com a vacinação em dia.' },
  { emoji: '❤️', title: 'Adoção Responsável', desc: 'Processo seguro que garante o bem-estar do animal e a compatibilidade com sua família.' },
  { emoji: '🏠', title: 'Acompanhamento', desc: 'Oferecemos suporte pós-adoção para garantir uma adaptação tranquila do pet ao novo lar.' },
  { emoji: '🤝', title: 'Parceiros Confiáveis', desc: 'Trabalhamos com abrigos e ONGs verificados, comprometidos com o bem-estar animal.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Navbar variant="light" />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__decorations" aria-hidden="true">
          <span className="hero__deco hero__deco--1">🐾</span>
          <span className="hero__deco hero__deco--2">💕</span>
          <span className="hero__deco hero__deco--3">🐾</span>
          <span className="hero__deco hero__deco--4">🐱</span>
          <span className="hero__deco hero__deco--5">🐶</span>
          <span className="hero__deco hero__deco--6">💕</span>
        </div>

        <div className="hero__content">
          <div className="hero__badge">🏠 Plataforma de Adoção Responsável</div>
          <h1 className="hero__title">
            Encontre seu novo<br />
            <span className="hero__title--green">melhor amigo</span>
          </h1>
          <p className="hero__subtitle">
            Conectamos pets que precisam de um lar com famílias cheias de amor.
            Milhares de cães e gatos estão esperando por você!
          </p>

          <div className="hero__divider">
            <span className="hero__divider-line" />
            <span className="hero__divider-text">Como deseja acessar?</span>
            <span className="hero__divider-line" />
          </div>

          <div className="hero__cards">
            {/* Adotante */}
            <div className="profile-card">
              <div className="profile-card__avatar">
                <img src="https://i.pravatar.cc/100?img=47" alt="Adotante" />
              </div>
              <div className="profile-card__icon profile-card__icon--green">💚</div>
              <h3 className="profile-card__title">Sou Adotante</h3>
              <p className="profile-card__desc">Quero encontrar um pet para fazer parte da minha família</p>
              <button
                className="btn btn--green"
                onClick={() => navigate('/login?tipo=ADOTANTE')}
              >
                🐾 Encontrar Pets
              </button>
            </div>

            {/* Administrador */}
            <div className="profile-card">
              <div className="profile-card__avatar">
                <img src="https://i.pravatar.cc/100?img=12" alt="Administrador" />
              </div>
              <div className="profile-card__icon profile-card__icon--blue">🛡️</div>
              <h3 className="profile-card__title">Sou Administrador</h3>
              <p className="profile-card__desc">Gerenciar animais e agendamentos do abrigo</p>
              <button
                className="btn btn--orange"
                onClick={() => navigate('/login?tipo=ADMIN')}
              >
                🔐 Acessar Painel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <h2 className="features__title">
          Por que adotar no <span className="features__title--green">Whiskerworld</span>?
        </h2>
        <div className="features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon">{f.emoji}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
