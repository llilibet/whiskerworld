import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usuariosService } from '../services/usuariosService';

export default function CadastroPage() {
  const navigate = useNavigate();
  const { tipo: tipoParam } = useParams();
  const tipo = (tipoParam || 'ADOTANTE').toUpperCase();
  const isAdmin = tipo === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      navigate('/login?tipo=ADMIN', { replace: true });
    }
  }, [isAdmin, navigate]);

  const [form, setForm] = useState({ nome: '', email: '', senha: '', aceitouTermos: false, aceitouPrivacidade: false });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [documentoAberto, setDocumentoAberto] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      await usuariosService.registrar({ ...form, tipo });
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fecharDocumento = () => setDocumentoAberto(null);

  return (
    <div className="page page--centered">
      <div className="auth-card">
        <div className="auth-card__icon">{isAdmin ? '🛡️' : '🐾'}</div>
        <h1 className="auth-card__title">Criar conta</h1>
        <p className="auth-card__subtitle">
          {isAdmin ? 'Cadastro de Administrador' : 'Junte-se ao Whiskerworld'}
        </p>

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
            <label className="form-label">
              <input type="checkbox" name="aceitouTermos" checked={form.aceitouTermos} onChange={(e) => setForm({ ...form, aceitouTermos: e.target.checked })} required />{' '}
              Aceito os <button type="button" className="document-link" onClick={() => setDocumentoAberto('termos')}>Termos de Uso</button>.
            </label>
            <label className="form-label">
              <input type="checkbox" name="aceitouPrivacidade" checked={form.aceitouPrivacidade} onChange={(e) => setForm({ ...form, aceitouPrivacidade: e.target.checked })} required />{' '}
              Aceito a <button type="button" className="document-link" onClick={() => setDocumentoAberto('privacidade')}>Política de Privacidade</button>.
            </label>
          </div>

          <button type="submit" className={`btn btn--full ${isAdmin ? 'btn--orange' : 'btn--green'}`} disabled={loading}>
            {loading ? 'Cadastrando…' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-card__footer">
          Já tem uma conta? <Link to={`/login?tipo=${tipo}`} className="link">Entrar</Link>
        </p>
      </div>

      {documentoAberto && (
        <div className="document-modal__backdrop" onClick={fecharDocumento}>
          <section
            className="document-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="document-modal__close" onClick={fecharDocumento} aria-label="Fechar documento">
              ×
            </button>
            <h2 id="document-modal-title" className="document-modal__title">
              {documentoAberto === 'termos' ? 'Termos de Uso' : 'Política de Privacidade'}
            </h2>
            {documentoAberto === 'termos' ? (
              <div className="document-modal__content">
                <p>Ao utilizar o Whiskerworld, você concorda em fornecer informações verdadeiras e em usar a plataforma de forma responsável.</p>
                <p>A plataforma conecta pessoas interessadas em adoção a animais cadastrados e não garante a conclusão de uma adoção ou agendamento.</p>
                <p>O usuário é responsável pelas informações fornecidas e por manter seus dados de acesso protegidos. O uso indevido da plataforma poderá resultar no bloqueio da conta.</p>
                <p>O cadastro e o uso dos recursos estão sujeitos a estes termos. Eles podem ser atualizados para refletir mudanças no sistema ou na atividade acadêmica.</p>
              </div>
            ) : (
              <div className="document-modal__content">
                <p>Coletamos os dados informados no cadastro, como nome e e-mail, para criar e administrar sua conta.</p>
                <p>Também tratamos dados relacionados ao uso da plataforma, como favoritos e agendamentos, para disponibilizar esses recursos.</p>
                <p>Os dados são utilizados para funcionamento do sistema e não devem ser compartilhados fora das finalidades da atividade sem base adequada.</p>
                <p>Você pode solicitar a exclusão da conta e dos dados relacionados pela área de usuário. Esta implementação tem finalidade acadêmica e não representa certificação de conformidade jurídica com a LGPD.</p>
              </div>
            )}
            <button type="button" className="btn btn--green document-modal__action" onClick={fecharDocumento}>
              Voltar ao cadastro
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
