# Relatório de Refatoração — Consolidar Expressão Condicional

## 1. Identificação

- **Sistema:** Whiskerworld
- **Técnica:** Consolidar Expressão Condicional
- **Branch da organização da entrega:** `refatoracao-consolidar-condicional`
- **Tipo de manutenção:** Perfectiva

## 2. Objetivo

Melhorar a legibilidade das condições de validação e autorização, representando cada regra por uma função auxiliar com nome explicativo.

Nos casos documentados, as condições já estavam agrupadas com operadores lógicos. A alteração consistiu em extrair essas expressões para funções nomeadas, preservando os critérios e a ordem de avaliação.

## 3. Problemas identificados

As expressões diretamente nos comandos `if` exigiam interpretar os detalhes da condição para compreender a regra aplicada.

A extração permite ler a intenção da regra no ponto de uso e consultar seus critérios na função auxiliar.

## 4. Alterações documentadas

### R1 — Validação das respostas do questionário

**Arquivo:** `backend/src/services/compatibilidadeService.js`

**Antes:**

```js
if (
  !respostas ||
  typeof respostas !== 'object' ||
  Array.isArray(respostas)
) {
  throw new AppError('Envie as respostas do questionário.', 400);
}
```

**Depois:**

```js
function respostasInvalidas(respostas) {
  return (
    !respostas ||
    typeof respostas !== 'object' ||
    Array.isArray(respostas)
  );
}
```

No ponto de validação:

```js
if (respostasInvalidas(respostas)) {
  throw new AppError('Envie as respostas do questionário.', 400);
}
```

**Benefício:** o nome identifica a validação das respostas, mantendo os três critérios originais.

| Antes | Depois |
|---|---|
| ![Compatibilidade antes](evidencias/prints/01-compatibilidade-antes.png) | ![Compatibilidade depois](evidencias/prints/02-compatibilidade-depois.png) |

### R2 — Dados obrigatórios do agendamento

**Arquivo:** `backend/src/services/agendamentosService.js`

**Antes:**

```js
if (!animal_id || !data_visita || !hora_visita) {
  throw new AppError(
    'animal_id, data_visita e hora_visita são obrigatórios.',
    400
  );
}
```

**Depois:**

```js
function faltamDadosDoAgendamento(animalId, dataVisita, horaVisita) {
  return !animalId || !dataVisita || !horaVisita;
}
```

No ponto de validação:

```js
if (faltamDadosDoAgendamento(animal_id, data_visita, hora_visita)) {
  throw new AppError(
    'animal_id, data_visita e hora_visita são obrigatórios.',
    400
  );
}
```

**Benefício:** a chamada expressa a ausência dos dados obrigatórios. A mensagem e o código HTTP foram mantidos.

| Condição antes | Condição depois |
|---|---|
| ![Agendamento antes](evidencias/prints/03-agendamento-condicao-antes.png) | ![Agendamento depois](evidencias/prints/04-agendamento-condicao-depois.png) |

| Local da função antes | Função adicionada |
|---|---|
| ![Início do arquivo antes](evidencias/prints/05-agendamento-funcao-antes.png) | ![Função auxiliar depois](evidencias/prints/06-agendamento-funcao-depois.png) |

### R3 — Cabeçalho de autenticação

**Arquivo:** `backend/src/middlewares/authMiddleware.js`

**Antes:**

```js
if (!authHeader || !authHeader.startsWith('Bearer ')) {
```

**Depois:**

```js
function cabecalhoAutenticacaoInvalido(authHeader) {
  return !authHeader || !authHeader.startsWith('Bearer ');
}
```

No ponto de validação:

```js
if (cabecalhoAutenticacaoInvalido(authHeader)) {
```

**Benefício:** o nome explica a verificação de ausência do cabeçalho ou do prefixo esperado. Essa condição verifica o formato do cabeçalho; a validação do token permanece no fluxo de autenticação.

| Antes | Depois |
|---|---|
| ![Autenticação antes](evidencias/prints/07-autenticacao-antes.png) | ![Autenticação depois](evidencias/prints/08-autenticacao-depois.png) |

### R4 — Perfil de administrador

**Arquivo:** `backend/src/middlewares/authMiddleware.js`

**Antes:**

```js
if (!req.usuario || req.usuario.tipo !== 'ADMIN') {
```

**Depois:**

```js
function usuarioNaoEhAdministrador(usuario) {
  return !usuario || usuario.tipo !== 'ADMIN';
}
```

No ponto de autorização:

```js
if (usuarioNaoEhAdministrador(req.usuario)) {
```

**Benefício:** a chamada identifica a regra que bloqueia usuários ausentes ou sem o perfil `ADMIN`.

| Antes | Depois |
|---|---|
| ![Administrador antes](evidencias/prints/09-administrador-antes.png) | ![Administrador depois](evidencias/prints/10-administrador-depois.png) |

## 5. Escopo desta documentação

Esta entrega documenta quatro expressões condicionais em três arquivos, com capturas do antes e depois e uma demonstração de equivalência.

As alterações de acompanhamento e frontend mencionadas no relatório anterior não integram o escopo comprovado pelas evidências reunidas aqui.

Não foram reunidas evidências suficientes para classificar uma alteração como oportunista ou registrar um par neutro de refatorações nesta documentação.

## 6. Preservação das condições

As expressões apresentadas mantêm:

- Os operadores lógicos.
- A ordem de avaliação e o curto-circuito.
- Os critérios de validação e autorização.
- As mensagens e os códigos HTTP apresentados nos trechos completos.

## 7. Demonstração e validação

O script `demonstracao/comparar-condicionais.js` compara as expressões originais com reproduções das funções auxiliares.

Resultado da execução:

| Condição | Casos comparados | Resultado |
|---|---:|---|
| Respostas do questionário | 11 | Equivalentes |
| Dados obrigatórios do agendamento | 216 | Equivalentes |
| Cabeçalho de autenticação | 9 | Equivalentes |
| Perfil de administrador | 8 | Equivalentes |
| **Total** | **244** | **Todas as comparações passaram** |

**Saída da execução:** [comparacao-condicionais.txt](evidencias/texto/comparacao-condicionais.txt)

Para reproduzir, na raiz do projeto:

```bash
node docs/tp5-refatoracao/consolidar-expressao-condicional/demonstracao/comparar-condicionais.js
```

### Limites da demonstração

O script não importa os serviços reais e não cobre todas as entradas possíveis. O resultado demonstra equivalência nos casos selecionados, sem comprovar todos os fluxos do sistema.

As capturas mostram alterações de código. Não foram anexados nesta entrega resultados de testes automatizados do projeto, build ou integração com Firebase.

## 8. Resultado

As condições passaram a ser representadas por funções com nomes explicativos, facilitando a leitura das regras.

Os 244 casos avaliados pelo script apresentaram resultados equivalentes. A mudança caracteriza manutenção perfectiva por melhorar a estrutura e a compreensão do código.