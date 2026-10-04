import { useNavigate } from 'react-router-dom';
import { clearToken, getUsuarioLogado } from '../services/api';

// Exibe erros em linguagem simples. Quando a sessão expirou, oferece a ação
// de recuperação (fazer login novamente) em vez de só mostrar a mensagem.
export default function ErroAlerta({ erro, style }) {
  const navigate = useNavigate();
  if (!erro) return null;

  const mensagem = typeof erro === 'string' ? erro : erro.message;

  if (!erro.sessaoExpirada) {
    return <div className="alert alert--error" role="alert" style={style}>{mensagem}</div>;
  }

  const handleLogin = () => {
    const tipo = getUsuarioLogado()?.tipo || 'ADOTANTE';
    clearToken();
    navigate(`/login?tipo=${tipo}`);
  };

  return (
    <div className="alert alert--error alert--acao" role="alert" style={style}>
      <span className="alert__icone" aria-hidden="true">⏰</span>
      <div className="alert__corpo">
        <strong className="alert__titulo">Não foi possível concluir a operação</strong>
        <p>{mensagem}</p>
        <p className="alert__dica">Os dados preenchidos nesta tela não foram enviados.</p>
      </div>
      <button type="button" className="btn btn--green btn--xs" onClick={handleLogin}>
        Fazer login novamente
      </button>
    </div>
  );
}
