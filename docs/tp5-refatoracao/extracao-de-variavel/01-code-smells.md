# 1. Code smells identificados

*Code smells* são sinais no código de que o design pode ser melhorado. Eles não são bugs: o sistema funciona, mas fica mais difícil de entender, testar e alterar. O capítulo 9 de *Engenharia de Software Moderna* apresenta um catálogo desses sinais e as refatorações que costumam resolvê-los.

Analisamos `backend/src` e `client/src` em busca de expressões difíceis de ler: condições compostas, números sem nome e trechos calculados mais de uma vez. Todos os casos abaixo podem ser tratados com **Extração de Variável**.

| # | Smell | Onde | Situação |
|---|---|---|---|
| S1 | Expressão condicional complexa | `acompanhamentosService.verificarAcesso` | Resolvido por R1 |
| S2 | Números mágicos | `compatibilidadeService` | Resolvido por R2 |
| S3 | Números mágicos | `fotosAcompanhamentoService` | Resolvido por R3 |
| S4 | Números mágicos duplicados | limite de 2 MB da foto | Mitigado por R4 |
| S5 | Expressões complexas e repetidas no frontend | páginas e serviços de `client/src` | Identificado, não tratado |

---

## S1 — Expressão condicional complexa em `verificarAcesso`

**Onde:** `backend/src/services/acompanhamentosService.js`, antes da refatoração:

```js
if (
  (paraRegistrar && !adotanteResponsavel) ||
  (!paraRegistrar && !adotanteResponsavel && !administrador)
) {
  throw new AppError('Você não tem permissão para acessar este acompanhamento.', 403);
}
```

**Por que é um smell:** a regra de negócio é simples: *registrar* é exclusivo do adotante responsável e *consultar* também é permitido ao administrador. A condição, porém, descreve quem **não** tem permissão, com cinco negações espalhadas em dois ramos. Para entender a regra, é preciso montar uma tabela-verdade de cabeça. Esse tipo de condição é onde erros de lógica costumam passar despercebidos.

**Como foi resolvido:** a condição virou a variável `temPermissao`, escrita de forma positiva e com um ramo para cada operação. Na integração com o PR #48, que levou a mesma condição para a função `acessoAoAcompanhamentoNegado`, a variável passou a ficar dentro dessa função. Detalhes em [02-refatoracoes-planejadas.md](02-refatoracoes-planejadas.md#r1--tempermissao-em-verificaracesso).

---

## S2 — Números mágicos em `compatibilidadeService`

**Onde:** `backend/src/services/compatibilidadeService.js`:

```js
if (pontuacao >= 10) { return 'Alta'; }
if (pontuacao >= 6)  { return 'Média'; }
...
pontuacaoMaxima: 12,
```

**Por que é um smell:** `10`, `6` e `12` são as regras centrais do questionário de compatibilidade, mas aparecem como números soltos. Quem lê `pontuacao >= 6` precisa deduzir que 6 é o mínimo para o nível Média. Esses valores são os primeiros candidatos a mudar quando o questionário ganhar perguntas novas, e hoje não há um lugar único onde encontrá-los.

No mesmo método, o resultado de `possuiImpedimento(respostas)` era passado direto como argumento de `definirNivel`, sem nome. Assim, a decisão mais importante da classificação (um impedimento força o nível Baixa) ficava escondida dentro de uma chamada.

**Como foi resolvido:** os números viraram `pontuacaoMaxima`, `pontuacaoMinimaAlta` e `pontuacaoMinimaMedia`, e o impedimento ganhou a variável `temImpedimento`. Detalhes em [02-refatoracoes-planejadas.md](02-refatoracoes-planejadas.md#r2--pontuação-em-compatibilidadeservice).

---

## S3 — Números mágicos em `fotosAcompanhamentoService`

**Onde:** `backend/src/services/fotosAcompanhamentoService.js`:

```js
if (!buffer.length || buffer.length > 2 * 1024 * 1024) { ... }

buffer.subarray(0, 8).equals(
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
);

expires: Date.now() + 15 * 60 * 1000,
```

**Por que é um smell:** cada expressão obriga quem lê a fazer uma conta ou consultar uma especificação. `2 * 1024 * 1024` é 2 MB. `15 * 60 * 1000` são 15 minutos em milissegundos. A sequência de bytes é a assinatura que identifica um arquivo PNG. São regras de segurança (tamanho máximo, formato verificado pelo conteúdo e validade do link da foto), mas nada no código diz isso.

**Como foi resolvido:** as expressões viraram `tamanhoMaximoFoto`, `assinaturaPng` e `validadeUrlTemporaria`, e o instante de expiração ganhou a variável `expiraEm`. Detalhes em [02-refatoracoes-planejadas.md](02-refatoracoes-planejadas.md#r3--limites-em-fotosacompanhamentoservice).

---

## S4 — Números mágicos duplicados: limite de 2 MB da foto

**Onde:** o mesmo limite aparece em quatro arquivos:

```text
backend/src/services/fotosAcompanhamentoService.js   buffer.length > 2 * 1024 * 1024
backend/src/middlewares/uploadFotoAcompanhamento.js  fileSize: 2 * 1024 * 1024
client/src/pages/AcompanhamentoPage.jsx              arquivo.size > 2 * 1024 * 1024
client/src/pages/AdminCadastrarAnimalPage.jsx        file.size > 2 * 1024 * 1024
```

**Por que é um smell:** se o limite mudar, os quatro lugares precisam mudar juntos. Como a expressão não tem nome, uma busca por "tamanho máximo" não encontra nenhum deles.

**Como foi mitigado:** nos dois arquivos do backend, a expressão ganhou o mesmo nome, `tamanhoMaximoFoto` (R3 e R4). Assim, uma busca pelo nome encontra os dois lugares. Os arquivos continuam com uma constante cada: compartilhar o valor exigiria criar um módulo de configuração e mudar o que os arquivos exportam, o que já é outra refatoração (*Move*). As duas cópias do frontend ficaram fora desta entrega, pelo mesmo motivo de S5.

Ao escrever os testes para R4, encontramos uma diferença entre os dois lugares do backend, descrita em [03-refatoracao-oportunista.md](03-refatoracao-oportunista.md#o-que-os-testes-revelaram).

---

## S5 — Expressões complexas e repetidas no frontend (não tratado)

**Onde:** vários trechos de `client/src`. Os principais:

| Arquivo | Expressão | Variável sugerida |
|---|---|---|
| `pages/AdminDashboardPage.jsx` | `ag.nome_usuario \|\| ag.email_usuario \|\| ...` repetido 3 vezes no mesmo item da lista | `nomeAdotante` |
| `pages/AdminDashboardPage.jsx` | rótulo do status com ternário aninhado dentro do JSX | `rotuloStatus` |
| `services/api.js` | `body && !(body instanceof FormData) && typeof body === 'object'` | `deveSerializarJson` |
| `services/api.js` | `auth && (res.status === 401 \|\| /token/i.test(json?.mensagem \|\| ''))` | `sessaoInvalida` |
| `pages/AnimaisListPage.jsx` | filtragem dentro de uma função anônima executada no meio do JSX | `filtrados`, calculada antes do `return` |
| `pages/AcompanhamentoPage.jsx` | condição de 5 termos que bloqueia o envio | `envioBloqueado` |

**Por que é um smell:** são os mesmos problemas de S1 a S4: condições longas sem nome, expressões calculadas várias vezes e lógica misturada à marcação.

**Situação:** os casos foram identificados, mas ficaram fora desta entrega porque o frontend só tem testes de acessibilidade e de rotas, que não cobrem esses trechos. Refatorar sem uma rede de segurança iria contra o processo que seguimos no backend: primeiro caracterizar o comportamento, depois alterar o código.
