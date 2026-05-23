import { Link, useNavigate } from 'react-router-dom';
import { getUsuarioLogado } from '../services/api';
import { usuariosService } from '../services/usuariosService';

export default function Navbar({ variant = 'light' }) {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();

  const handleLogout = () => {
    usuariosService.logout();
    navigate('/');
  };

  if (variant === 'adotante') {
    return (
      <nav className="navbar navbar--adotante">
        <div className="navbar__logo">
          <span className="navbar__paw">🐾</span>
          <span className="navbar__brand" style={{ color: '#fff' }}>Whiskerworld</span>
        </div>
        <div className="navbar__links">
          <Link to="/dashboard" className="navbar__link" style={{ color: 'rgba(255,255,255,.85)' }}>Início</Link>
        </div>
      </nav>
    );
  }

  if (variant === 'adotante-nav') {
    return (
      <nav className="navbar navbar--light">
        <div className="navbar__logo">
          <Link to="/dashboard" className="navbar__brand-link">
            <span className="navbar__paw">🐾</span>
            <span className="navbar__brand">Whiskerworld</span>
          </Link>
        </div>
        <div className="navbar__links">
          <Link to="/dashboard" className="navbar__link">Início</Link>
          <Link to="/dashboard" className="navbar__link">Minha Área</Link>
        </div>
      </nav>
    );
  }

  if (variant === 'admin') {
    return (
      <nav className="navbar navbar--admin">
        <div className="navbar__logo">
          <span className="navbar__paw">🐾</span>
          <span className="navbar__brand">Whiskerworld</span>
        </div>
        <div className="navbar__actions">
          <button className="btn btn--outline-white" onClick={() => navigate('/')}>
            🏠 Início
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar--light">
      <div className="navbar__logo">
        <Link to="/" className="navbar__brand-link">
          <span className="navbar__paw">🐾</span>
          <span className="navbar__brand">Whiskerworld</span>
        </Link>
      </div>
      <div className="navbar__links">
        <Link to="/" className="navbar__link">Adotar</Link>
        <Link to="/" className="navbar__link">Sobre</Link>
        {usuario ? (
          <button className="btn btn--green" onClick={handleLogout}>Sair</button>
        ) : (
          <Link to="/login" className="btn btn--green">Entrar</Link>
        )}
      </div>
    </nav>
  );
}
