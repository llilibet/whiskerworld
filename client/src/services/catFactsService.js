const MEOW_FACTS_API_URL =
  'https://meowfacts.herokuapp.com/?lang=por-br';

export async function buscarCuriosidadeGato() {
  const response = await fetch(MEOW_FACTS_API_URL);

  if (!response.ok) {
    throw new Error('Não foi possível buscar a curiosidade.');
  }

  const data = await response.json();
  const curiosidade = data?.data?.[0];

  if (!curiosidade) {
    throw new Error('A API retornou uma resposta inesperada.');
  }

  return curiosidade;
}