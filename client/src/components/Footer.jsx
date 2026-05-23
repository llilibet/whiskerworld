import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <span className="footer__paw">🐾</span>
          <span className="footer__name">Whiskerworld</span>
        </div>
        <p className="footer__tagline">
          Transformando vidas através da adoção responsável. Cada pet merece um lar cheio de amor.
        </p>
        <div className="footer__links">
          <Link to="/" className="footer__link">Adotar</Link>
          <Link to="/" className="footer__link">Sobre</Link>
          <Link to="/login" className="footer__link">Entrar</Link>
          <Link to="/cadastro" className="footer__link">Cadastrar</Link>
        </div>
        <p className="footer__copy">© 2025 Whiskerworld. Feito 🐾 para os pets.</p>
      </div>
    </footer>
  );
}
