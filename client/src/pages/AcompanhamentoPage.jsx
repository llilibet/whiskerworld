import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { acompanhamentosService } from '../services/acompanhamentosService';
import { getUsuarioLogado } from '../services/api';

function dataHoje() {
  const hoje = new Date();

  return [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, '0'),
    String(hoje.getDate()).padStart(2, '0'),
  ].join('-');
}

function formatarData(valor) {
  if (!valor) return 'Data não informada';

  const [ano, mes, dia] = valor.split('-');
  return `${dia}/${mes}/${ano}`;
}

function ordenarRegistros(registros) {
  return [...registros].sort(
    (a, b) =>
      (a.data_acompanhamento || '').localeCompare(
        b.data_acompanhamento || ''
      ) ||
      (a.criadoEm || '').localeCompare(b.criadoEm || '')
  );
}

export default function AcompanhamentoPage() {
  const { adocaoId } = useParams();
  const navigate = useNavigate();
  const administrador = getUsuarioLogado()?.tipo === 'ADMIN';

  const envioEmAndamento = useRef(false);
  const inputFoto = useRef(null);

  const [data, setData] = useState(dataHoje);
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [erroFoto, setErroFoto] = useState('');
  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState('');
  const [erroEnvio, setErroEnvio] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    let ativo = true;

    setCarregando(true);
    setErroCarregamento('');
    setAcompanhamentos([]);
    setErroEnvio('');
    setMensagem('');
    setDescricao('');
    setData(dataHoje());
    setFoto(null);
    setErroFoto('');

    if (inputFoto.current) {
      inputFoto.current.value = '';
    }

    acompanhamentosService.listar(adocaoId)
      .then((dados) => {
        if (ativo) {
          setAcompanhamentos(ordenarRegistros(dados || []));
        }
      })
      .catch((erro) => {
        if (ativo) {
          setErroCarregamento(
            erro.message || 'Não foi possível carregar o histórico.'
          );
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [adocaoId]);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    setFoto(null);
    setErroFoto('');
    setMensagem('');

    if (!arquivo) return;

    const formatos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!formatos.includes(arquivo.type)) {
      setErroFoto('Escolha uma fotografia JPEG, PNG ou WebP.');
      event.target.value = '';
      return;
    }

    if (!arquivo.size || arquivo.size > 2 * 1024 * 1024) {
      setErroFoto(
        'A fotografia deve conter dados e ter no máximo 2 MB.'
      );
      event.target.value = '';
      return;
    }

    setFoto(arquivo);
  }

  function limparFoto() {
    setFoto(null);
    setErroFoto('');

    if (inputFoto.current) {
      inputFoto.current.value = '';
    }
  }

  async function registrar(event) {
    event.preventDefault();

    if (
      administrador ||
      envioEmAndamento.current ||
      carregando ||
      erroCarregamento ||
      erroFoto
    ) {
      return;
    }

    setErroEnvio('');
    setMensagem('');

    if (!data || !descricao.trim()) {
      setErroEnvio('Preencha a data e a descrição.');
      return;
    }

    envioEmAndamento.current = true;
    setEnviando(true);

    try {
      const novoRegistro = await acompanhamentosService.registrar(
        adocaoId,
        {
          data_acompanhamento: data,
          descricao: descricao.trim(),
        },
        foto
      );

      setAcompanhamentos((anteriores) =>
        ordenarRegistros([...anteriores, novoRegistro])
      );

      setDescricao('');
      limparFoto();
      setMensagem('Acompanhamento registrado com sucesso!');

      try {
        const registros =
          await acompanhamentosService.listar(adocaoId);

        setAcompanhamentos(ordenarRegistros(registros || []));
      } catch {
        setMensagem(
          'Acompanhamento salvo! Não foi possível atualizar as fotos do histórico. Recarregue a página para tentar novamente.'
        );
      }
    } catch (erro) {
      setErroEnvio(
        erro.message ||
          'Não foi possível registrar o acompanhamento.'
      );
    } finally {
      envioEmAndamento.current = false;
      setEnviando(false);
    }
  }

  const estiloCampo = {
    width: '100%',
    boxSizing: 'border-box',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #767676',
    fontFamily: 'inherit',
    fontSize: 16,
  };

  const estiloLabel = {
    display: 'block',
    fontWeight: 600,
    marginBottom: 8,
  };

  return (
    <div
      className="page"
      style={{ background: '#edf7ed', minHeight: '100vh' }}
    >
      <Navbar variant={administrador ? 'admin' : 'adotante'} />

      <main
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '32px 16px',
        }}
      >
        <h1>Acompanhamento pós-adoção</h1>

        <p>
          {administrador
            ? 'Consulte as atualizações sobre a adaptação e o bem-estar do animal enviadas pelo adotante.'
            : 'Conte como o animal está se adaptando ao novo lar e registre novidades sobre seus cuidados e bem-estar.'}
        </p>

        {carregando ? (
          <p role="status">Carregando acompanhamento…</p>
        ) : erroCarregamento ? (
          <p role="alert">{erroCarregamento}</p>
        ) : (
          <>
            {!administrador && (
              <section className="panel">
                <h2 className="panel__title">
                  Registrar atualização
                </h2>

                <form onSubmit={registrar}>
                  <div style={{ marginBottom: 20 }}>
                    <label
                      htmlFor="data-acompanhamento"
                      style={estiloLabel}
                    >
                      Data do acompanhamento
                    </label>

                    <input
                      id="data-acompanhamento"
                      type="date"
                      value={data}
                      onChange={(event) => {
                        setData(event.target.value);
                        setErroEnvio('');
                        setMensagem('');
                      }}
                      required
                      disabled={enviando}
                      style={estiloCampo}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label
                      htmlFor="descricao-acompanhamento"
                      style={estiloLabel}
                    >
                      Como está a adaptação do animal?
                    </label>

                    <textarea
                      id="descricao-acompanhamento"
                      value={descricao}
                      onChange={(event) => {
                        setDescricao(event.target.value);
                        setErroEnvio('');
                        setMensagem('');
                      }}
                      rows={5}
                      maxLength={5000}
                      required
                      disabled={enviando}
                      placeholder="Conte sobre alimentação, comportamento, saúde e adaptação…"
                      style={{
                        ...estiloCampo,
                        resize: 'vertical',
                      }}
                    />

                    <p className="muted">
                      {descricao.length}/5000 caracteres
                    </p>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label
                      htmlFor="foto-acompanhamento"
                      style={estiloLabel}
                    >
                      Fotografia — opcional
                    </label>

                    <input
                      ref={inputFoto}
                      id="foto-acompanhamento"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={selecionarFoto}
                      disabled={enviando}
                      aria-describedby="orientacao-foto"
                    />

                    <p id="orientacao-foto" className="muted">
                      JPEG, PNG ou WebP, com no máximo 2 MB.
                    </p>

                    {foto && (
                      <p>Foto selecionada: {foto.name}</p>
                    )}

                    {(foto || erroFoto) && (
                      <button
                        type="button"
                        className="btn btn--outline"
                        disabled={enviando}
                        onClick={limparFoto}
                      >
                        Limpar seleção
                      </button>
                    )}

                    {erroFoto && (
                      <p role="alert">{erroFoto}</p>
                    )}
                  </div>

                  {erroEnvio && (
                    <p role="alert">{erroEnvio}</p>
                  )}

                  {mensagem && (
                    <p role="status">{mensagem}</p>
                  )}

                  <button
                    type="submit"
                    className="btn btn--green"
                    disabled={enviando || Boolean(erroFoto)}
                  >
                    {enviando
                      ? 'Salvando…'
                      : 'Registrar acompanhamento'}
                  </button>
                </form>
              </section>
            )}

            <section className="panel">
              <h2 className="panel__title">
                Histórico de acompanhamentos
              </h2>

              {acompanhamentos.length === 0 ? (
                <p className="muted">
                  Ainda não há atualizações para esta adoção.
                </p>
              ) : (
                acompanhamentos.map((registro) => (
                  <article
                    key={registro.id}
                    style={{
                      padding: '16px 0',
                      borderBottom: '1px solid #d5e5d5',
                    }}
                  >
                    <h3>
                      {formatarData(
                        registro.data_acompanhamento
                      )}
                    </h3>

                    <p
                      style={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {registro.descricao}
                    </p>

                    {registro.foto_url && (
                      <img
                        src={registro.foto_url}
                        alt={`Fotografia do acompanhamento de ${formatarData(
                          registro.data_acompanhamento
                        )}`}
                        loading="lazy"
                        style={{
                          display: 'block',
                          width: '100%',
                          maxWidth: 480,
                          height: 'auto',
                          borderRadius: 12,
                          marginTop: 12,
                        }}
                      />
                    )}
                  </article>
                ))
              )}
            </section>
          </>
        )}

        <button
          type="button"
          className="btn btn--outline"
          disabled={enviando}
          onClick={() =>
            navigate(administrador ? '/admin' : '/dashboard')
          }
        >
          Voltar ao painel
        </button>
      </main>
    </div>
  );
}