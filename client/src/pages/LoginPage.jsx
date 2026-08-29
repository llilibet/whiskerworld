import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get('tipo') || 'ADOTANTE';
  const isAdmin = tipo === 'ADMIN';

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, loginGoogle, loading, erro } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha);
    } catch { /* erro já capturado no hook */ }
  };

  return (
    <div className={`login-page ${isAdmin ? 'login-page--admin' : 'login-page--adotante'}`}>
      {/* ── Painel esquerdo ── */}
      <div className="login-left">
        <div className="login-left__content">
          <div className="login-left__icon">{isAdmin ? '🛡️' : '🐾'}</div>
          <h2 className="login-left__title">
            {isAdmin ? 'Painel Administrativo' : 'Bem-vindo de volta!'}
          </h2>
          <p className="login-left__subtitle">
            {isAdmin
              ? 'Acesse o painel para gerenciar os animais e agendamentos do abrigo'
              : 'Encontre seu próximo melhor amigo'}
          </p>
        </div>
        <div className="login-left__decorations" aria-hidden="true">
          <span>🐾</span><span>🐶</span><span>🐾</span><span>🐱</span>
        </div>
      </div>

      {/* ── Formulário direito ── */}
      <div className="login-right">
        <Link to="/" className="login-back">← Voltar ao início</Link>

        <div className="login-form-box">
          <div className="login-form-box__icon">🔒</div>
          <h1 className="login-form-box__title">Entrar</h1>
          <p className="login-form-box__subtitle">Acesse sua conta no Whiskerworld</p>

          <div className={`login-badge ${isAdmin ? 'login-badge--admin' : 'login-badge--adotante'}`}>
            {isAdmin ? '🔵 Área do Administrador' : '💚 Área do Adotante'}
          </div>

          {erro && <div className="alert alert--error">{erro}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">🔵 E-mail</label>
              <input
                className="form-input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">🔒 Senha</label>
              <div className="form-input-wrapper">
                <input
                  className="form-input"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="form-eye-btn"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn--full ${isAdmin ? 'btn--orange' : 'btn--green'}`}
              disabled={loading}
            >
              {loading ? 'Entrando…' : '🔐 Entrar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', color: '#aaa', margin: '12px 0', fontSize: '13px' }}>ou</div>
          <button
            type="button"
            className="btn btn--full"
            style={{ background: '#fff', border: '1px solid #ddd', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => loginGoogle(tipo)}
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" style={{ width: '18px', height: '18px' }} alt="Google" />
            Entrar com Google
          </button>

          {!isAdmin && (
            <p className="login-cadastro-link">
              Ainda não tem uma conta?{' '}
              <Link to={`/cadastro/${tipo}`} className="link">Cadastre-se</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
