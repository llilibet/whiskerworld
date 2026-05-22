import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';

export default function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', tipo: 'ADOTANTE' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      await usuariosService.registrar(form);
      navigate('/login');
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--centered">
      <div className="auth-card">
        <div className="auth-card__icon">🐾</div>
        <h1 className="auth-card__title">Criar conta</h1>
        <p className="auth-card__subtitle">Junte-se ao Whiskerworld</p>

        {erro && <div className="alert alert--error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" name="nome" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input className="form-input" type="password" name="senha" value={form.senha} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Perfil</label>
            <select className="form-select" name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="ADOTANTE">Adotante</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button type="submit" className="btn btn--green btn--full" disabled={loading}>
            {loading ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-card__footer">
          Já tem uma conta? <Link to="/login" className="link">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
