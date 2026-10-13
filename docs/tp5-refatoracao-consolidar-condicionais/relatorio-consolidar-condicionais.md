# Relatório de Refatoração — Consolidar Expressão Condicional

## 1. Identificação

- **Sistema:** Whiskerworld
- **Técnica:** Consolidar Expressão Condicional
- **Branch:** refatoracao/consolidar-condicionais
- **Tipo de manutenção:** Perfectiva

## 2. Objetivo

Melhorar a legibilidade do código por meio da extração de expressões condicionais para funções menores com nomes explicativos, preservando o comportamento do sistema.

As condições selecionadas já estavam agrupadas com operadores lógicos. A refatoração consistiu em encapsular essas expressões em funções que representam claramente a intenção de cada regra.

## 3. Alterações realizadas

### 3.1. Validação das respostas do questionário

**Arquivo:** `backend/src/services/compatibilidadeService.js`

**Função alterada:** `calcularCompatibilidade`

A condição que verifica se as respostas estão ausentes, não são um objeto ou são um array foi extraída para `respostasInvalidas`.

**Antes:**

~~~js
if (
  !respostas ||
  typeof respostas !== 'object' ||
  Array.isArray(respostas)
) {
  throw new AppError('Envie as respostas do questionário.', 400);
}
~~~

**Depois:**

~~~js
function respostasInvalidas(respostas) {
  return (
    !respostas ||
    typeof respostas !== 'object' ||
    Array.isArray(respostas)
  );
}
~~~

Na função original:

~~~js
if (respostasInvalidas(respostas)) {
  throw new AppError('Envie as respostas do questionário.', 400);
}
~~~

**Benefício:** o nome da função explica a regra de validação e reduz a quantidade de detalhes no início do cálculo de compatibilidade.

### 3.2. Campos obrigatórios do agendamento

**Arquivo:** `backend/src/services/agendamentosService.js`

**Função alterada:** `criarAgendamento`

A verificação de ausência de animal, data ou horário foi extraída para `faltamDadosDoAgendamento`.

**Antes:**

~~~js
if (!animal_id || !data_visita || !hora_visita) {
  throw new AppError(
    'animal_id, data_visita e hora_visita são obrigatórios.',
    400
  );
}
~~~

**Depois:**

~~~js
function faltamDadosDoAgendamento(animalId, dataVisita, horaVisita) {
  return !animalId || !dataVisita || !horaVisita;
}
~~~

Na função original:

~~~js
if (faltamDadosDoAgendamento(animal_id, data_visita, hora_visita)) {
  throw new AppError(
    'animal_id, data_visita e hora_visita são obrigatórios.',
    400
  );
}
~~~

**Benefício:** a condição passa a expressar diretamente a ausência dos dados obrigatórios do agendamento.

### 3.3. Validação do cabeçalho de autenticação

**Arquivo:** `backend/src/middlewares/authMiddleware.js`

**Função alterada:** `autenticarToken`

A condição que verifica a ausência do cabeçalho ou do prefixo `Bearer ` foi extraída para `cabecalhoAutenticacaoInvalido`.

**Antes:**

~~~js
if (!authHeader || !authHeader.startsWith('Bearer ')) {
~~~

**Depois:**

~~~js
function cabecalhoAutenticacaoInvalido(authHeader) {
  return !authHeader || !authHeader.startsWith('Bearer ');
}
~~~

Na função original:

~~~js
if (cabecalhoAutenticacaoInvalido(authHeader)) {
~~~

**Benefício:** a função nomeia a verificação do formato do cabeçalho. A verificação do token pelo Firebase continua no fluxo original.

### 3.4. Verificação do perfil de administrador

**Arquivo:** `backend/src/middlewares/authMiddleware.js`

**Função alterada:** `apenasAdmin`

A condição que verifica se o usuário está ausente ou não possui o perfil `ADMIN` foi extraída para `usuarioNaoEhAdministrador`.

**Antes:**

~~~js
if (!req.usuario || req.usuario.tipo !== 'ADMIN') {
~~~

**Depois:**

~~~js
function usuarioNaoEhAdministrador(usuario) {
  return !usuario || usuario.tipo !== 'ADMIN';
}
~~~

Na função original:

~~~js
if (usuarioNaoEhAdministrador(req.usuario)) {
~~~

**Benefício:** a condição de bloqueio fica identificada por um nome que descreve a regra de autorização.

### 3.5. Validação do identificador da adoção

**Arquivo:** `backend/src/services/acompanhamentosService.js`

**Função alterada:** `verificarAcesso`

A condição que verifica se o identificador não é uma string, está vazio após remover espaços ou contém `/` foi extraída para `identificadorAdocaoInvalido`.

**Antes:**

~~~js
if (
  typeof adocaoId !== 'string' ||
  !adocaoId.trim() ||
  adocaoId.includes('/')
) {
~~~

**Depois:**

~~~js
function identificadorAdocaoInvalido(adocaoId) {
  return (
    typeof adocaoId !== 'string' ||
    !adocaoId.trim() ||
    adocaoId.includes('/')
  );
}
~~~

Na função original:

~~~js
if (identificadorAdocaoInvalido(adocaoId)) {
~~~

**Benefício:** os critérios de validade do identificador ficam agrupados em uma função específica.

### 3.6. Permissão de acesso ao acompanhamento

**Arquivo:** `backend/src/services/acompanhamentosService.js`

**Função alterada:** `verificarAcesso`

A expressão que combina a ação solicitada com as permissões do adotante e do administrador foi extraída para `acessoAoAcompanhamentoNegado`.

**Antes:**

~~~js
if (
  (paraRegistrar && !adotanteResponsavel) ||
  (!paraRegistrar && !adotanteResponsavel && !administrador)
) {
~~~

**Depois:**

~~~js
function acessoAoAcompanhamentoNegado(
  paraRegistrar,
  adotanteResponsavel,
  administrador
) {
  return (
    (paraRegistrar && !adotanteResponsavel) ||
    (!paraRegistrar && !adotanteResponsavel && !administrador)
  );
}
~~~

Na função original:

~~~js
if (
  acessoAoAcompanhamentoNegado(
    paraRegistrar,
    adotanteResponsavel,
    administrador
  )
) {
~~~

**Benefício:** a expressão mais complexa passa a ter um nome que indica seu propósito.

As regras originais foram preservadas:

- O registro exige que o usuário seja o adotante responsável.
- A consulta permite o adotante responsável ou um administrador.

## 4. Alteração restante para concluir o escopo

### 4.1. Bloqueio do registro no frontend

**Arquivo:** `client/src/pages/AcompanhamentoPage.jsx`

**Função a alterar:** `registrar`

Esta é a última alteração orientada no escopo, cuja aplicação local ainda precisa ser confirmada.

A expressão verifica perfil de administrador, envio em andamento, carregamento e erros que impedem o registro.

**Antes:**

~~~js
if (
  administrador ||
  envioEmAndamento.current ||
  carregando ||
  erroCarregamento ||
  erroFoto
) {
  return;
}
~~~

**Depois:**

Adicionar dentro do componente, antes de `registrar`:

~~~js
function registroEstaBloqueado() {
  return (
    administrador ||
    envioEmAndamento.current ||
    carregando ||
    erroCarregamento ||
    erroFoto
  );
}
~~~

Na função `registrar`:

~~~js
if (registroEstaBloqueado()) {
  return;
}
~~~

**Benefício:** a condição passa a explicar diretamente que o registro está bloqueado. A função consulta os estados e a referência de envio no momento em que é chamada.

## 5. Resumo do escopo

| Arquivo | Funções extraídas |
| --- | --- |
| compatibilidadeService.js | respostasInvalidas |
| agendamentosService.js | faltamDadosDoAgendamento |
| authMiddleware.js | cabecalhoAutenticacaoInvalido; usuarioNaoEhAdministrador |
| acompanhamentosService.js | identificadorAdocaoInvalido; acessoAoAcompanhamentoNegado |
| AcompanhamentoPage.jsx | registroEstaBloqueado — aplicação local a confirmar |

O escopo completo compreende sete expressões condicionais em cinco arquivos.

## 6. Preservação do comportamento

A refatoração mantém:

- Os operadores lógicos e a ordem de avaliação.
- Os critérios de validação e autorização.
- As mensagens de erro e os códigos HTTP.
- O cálculo da pontuação de compatibilidade.
- Os fluxos de agendamento e acompanhamento.

As funções extraídas do backend permanecem internas aos módulos, sem necessidade de alterar `module.exports`.

## 7. Validação

Na cópia de trabalho utilizada para preparar as sete alterações, foram obtidos os seguintes resultados:

| Verificação | Resultado |
| --- | --- |
| Testes existentes do backend | 9 aprovados |
| Testes existentes do frontend | 7 aprovados |
| Build de produção do frontend | Aprovado |
| Comparação das expressões originais com as funções extraídas | 281 combinações equivalentes |
| git diff --check | Aprovado |

Esses resultados correspondem à cópia preparada durante a análise. A versão editada localmente no VS Code deve ser validada após concluir as substituições.

**Na raiz do projeto:**

~~~bash
node --test backend/tests/*.test.js
~~~

**Na pasta client:**

~~~bash
npm test
npm run build
~~~

Os testes existentes e a comparação das expressões não cobrem todos os fluxos de integração com Firebase.

## 8. Resultado

As regras condicionais passaram a ser representadas por funções pequenas com nomes explicativos, facilitando a leitura e a manutenção do código.

A mudança caracteriza manutenção perfectiva porque melhora a estrutura interna e a compreensibilidade do sistema, preservando as funcionalidades existentes.