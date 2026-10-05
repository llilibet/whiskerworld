import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { compatibilidadeService } from '../services/compatibilidadeService';

const perguntas = [
  {
    id: 'tipoMoradia',
    texto: 'Qual é o seu tipo de residência?',
    opcoes: [
      ['casa', 'Casa'],
      ['apartamento', 'Apartamento'],
      ['outro', 'Outro'],
    ],
  },
  {
    id: 'permiteAnimais',
    texto: 'O imóvel permite animais?',
    opcoes: [
      ['sim', 'Sim'],
      ['nao', 'Não'],
      ['naoSei', 'Ainda preciso confirmar'],
    ],
  },
  {
    id: 'espacoAdequado',
    texto: 'Existe espaço adequado e seguro para o animal?',
    opcoes: [
      ['sim', 'Sim'],
      ['adaptar', 'Preciso fazer adaptações'],
      ['nao', 'Não'],
    ],
  },
  {
    id: 'temCriancas',
    texto: 'Há crianças na residência?',
    opcoes: [
      ['sim', 'Sim'],
      ['nao', 'Não'],
    ],
  },
  {
    id: 'outrosAnimais',
    texto: 'Há outros animais na residência?',
    opcoes: [
      ['sim', 'Sim'],
      ['nao', 'Não'],
    ],
  },
  {
    id: 'horasSozinho',
    texto: 'Por quantas horas por dia o animal ficará sozinho?',
    opcoes: [
      ['ate4', 'Até 4 horas'],
      ['entre4e8', 'Mais de 4 e até 8 horas'],
      ['mais8', 'Mais de 8 horas'],
    ],
  },
  {
    id: 'cuidadosDiarios',
    texto:
      'Você tem disponibilidade para cuidados diários e passeios, quando necessários?',
    opcoes: [
      ['sim', 'Sim'],
      ['organizar', 'Preciso organizar minha rotina'],
      ['nao', 'Não'],
    ],
  },
  {
    id: 'condicoesFinanceiras',
    texto: 'Você consegue custear alimentação e atendimento veterinário?',
    opcoes: [
      ['sim', 'Sim'],
      ['planejar', 'Preciso me planejar'],
      ['nao', 'Não neste momento'],
    ],
  },
  {
    id: 'experiencia',
    texto: 'Você possui experiência anterior com animais?',
    opcoes: [
      ['sim', 'Sim'],
      ['nao', 'Não, será minha primeira experiência'],
    ],
  },
  {
    id: 'concordancia',
    texto: 'Todos os moradores concordam com a adoção?',
    opcoes: [
      ['sim', 'Sim, ou moro sozinho(a)'],
      ['conversar', 'Ainda precisamos conversar'],
      ['nao', 'Não'],
    ],
  },
];

export default function CompatibilidadePage() {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [respostas, setRespostas] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function atualizarResposta(id, valor) {
    setRespostas((anteriores) => ({
      ...anteriores,
      [id]: valor,
    }));

    setMensagem('');
    setResultado(null);
  }

  async function enviarQuestionario(event) {
    event.preventDefault();

    if (enviando) return;

    const incompleto = perguntas.some(
      (pergunta) => !respostas[pergunta.id]
    );

    if (incompleto) {
      setMensagem('Responda todas as perguntas antes de continuar.');
      return;
    }

    setEnviando(true);
    setMensagem('');
    setResultado(null);

    try {
      const dados = await compatibilidadeService.avaliar(
        animalId,
        respostas
      );

      setResultado(dados);
    } catch (erro) {
      setMensagem(
        erro.message || 'Não foi possível avaliar as respostas.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="animais-page">
      <main
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '32px 16px',
        }}
      >
        <h1>Questionário de compatibilidade</h1>

        <p>
          Responda às perguntas para refletir sobre sua rotina e os
          cuidados necessários para a adoção.
        </p>

        <p>
          O resultado é apenas orientativo e não substitui a avaliação
          dos responsáveis pela adoção.
        </p>

        <form onSubmit={enviarQuestionario}>
          {perguntas.map((pergunta, indice) => (
            <div key={pergunta.id} style={{ marginBottom: 20 }}>
              <label
                htmlFor={pergunta.id}
                style={{
                  display: 'block',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {indice + 1}. {pergunta.texto}
              </label>

              <select
                id={pergunta.id}
                name={pergunta.id}
                value={respostas[pergunta.id] || ''}
                onChange={(event) =>
                  atualizarResposta(pergunta.id, event.target.value)
                }
                required
                disabled={enviando}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #767676',
                  background: '#fff',
                  color: '#222',
                  fontSize: 16,
                }}
              >
                <option value="">Selecione uma resposta</option>

                {pergunta.opcoes.map(([valor, texto]) => (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <p role="status">{mensagem}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              type="submit"
              className="btn btn--green"
              disabled={enviando}
            >
              {enviando ? 'Calculando...' : 'Verificar compatibilidade'}
            </button>

            <button
              type="button"
              className="btn btn--outline"
              onClick={() => navigate(`/animal/${animalId}`)}
            >
              Voltar aos detalhes do animal
            </button>
          </div>
        </form>

        {resultado && (
          <section
            role="status"
            style={{
              marginTop: 24,
              padding: 24,
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #767676',
            }}
          >
            <h2>{resultado.nivel} compatibilidade</h2>

            <p>
              Avaliação referente a{' '}
              <strong>{resultado.nomeAnimal}</strong>.
            </p>

            <p>{resultado.mensagem}</p>

            {resultado.orientacoes.length > 0 && (
              <>
                <h3>Pontos para considerar</h3>

                <ul>
                  {resultado.orientacoes.map((orientacao) => (
                    <li key={orientacao}>{orientacao}</li>
                  ))}
                </ul>
              </>
            )}

            <p>{resultado.aviso}</p>

            <button
              type="button"
              className="btn btn--green"
              onClick={() => navigate(`/agendar/${animalId}`)}
            >
              Prosseguir para agendar visita
            </button>
          </section>
        )}
      </main>
    </div>
  );
}