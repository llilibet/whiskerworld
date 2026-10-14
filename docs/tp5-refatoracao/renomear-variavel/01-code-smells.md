# 1. Code smells identificados

Conforme descrito no capítulo 9 de *Engenharia de Software Moderna*, os *code smells* representam indícios de que o design do código necessita de aprimoramentos. Eles não caracterizam falhas de funcionamento, mas sim fatores que dificultam a leitura, a testabilidade e a manutenção do sistema. 

Os exemplos listados a seguir se enquadram na categoria de **Nomes Misteriosos** (*Mysterious Name*, segundo a classificação de Fowler), que ocorre quando o nome de uma variável não reflete adequadamente o seu propósito. A técnica de refatoração aplicada para solucionar esse problema é a **Renomear Variável** (*Rename Variable*).

## Resumo

| # | Smell | Onde | Situação |
|---|---|---|---|
| S1 | Nome misterioso (`count`) | `backend/src/services/favoritosService.js`, `removerFavorito` | Resolvido por R1 |
| S2 | Nome genérico (`body`) | `backend/src/services/animaisService.js`, `criarAnimal` | Resolvido por R2 |
| S3 | Nome genérico (`body`) | `backend/src/services/animaisService.js`, `atualizarAnimal` | Resolvido por R3 |
| S4 | Nome abreviado (`err`) | `backend/src/controllers/usuariosController.js` | Resolvido por R4 |
| S5 | Nome misterioso (`count`) | `backend/src/services/animaisService.js`, `deletarAnimal` | Resolvido por R5 |
| S6 | Nome vago (`result`, `atual`) | `usuariosController.js` e `atualizarAnimal` | Resolvido por O1 e O2 (oportunista) |
| S7 | Nome genérico (`val`) | `client/src/pages/AnimaisListPage.jsx` | Identificado, **não tratado** |
| S8 | Nome abreviado (`err`) | `animaisController.js`, `agendamentosController.js`, `favoritosController.js`, `authMiddleware.js` | Identificado, **não tratado** |

## S1 — `count` em `removerFavorito`

**Onde:** `backend/src/services/favoritosService.js`.

**Por que é um smell:** O termo `count` é excessivamente vago. Ao se deparar com a instrução `if (!count)`, o desenvolvedor é obrigado a consultar o repositório para entender que a variável armazena a quantidade de itens excluídos (já que `favoritosRepository.remove` retorna `snap.size` ou `0` caso não encontre registros).

**Como foi resolvido:** O nome foi alterado para `quantidadeRemovida` (R1). Com isso, a validação `if (!quantidadeRemovida)` passa a transmitir de forma clara a ideia de "se nenhum item foi excluído".

## S2 e S3 — `body` em `criarAnimal` e `atualizarAnimal`

**Onde:** `backend/src/services/animaisService.js`.

**Por que é um smell:** A palavra `body` indica apenas a origem da informação (o corpo da requisição HTTP), falhando em expressar o seu real conteúdo. Como as duas funções são extensas e o termo se repete diversas vezes (10 em `criarAnimal` e 19 em `atualizarAnimal`), a leitura se torna confusa, pois não fica claro imediatamente se o objeto se refere a um novo cadastro ou a uma edição.

**Como foi resolvido:** O termo `body` foi substituído por `dadosNovoAnimal` na função `criarAnimal` (R2) e por `dadosAtualizacao` em `atualizarAnimal` (R3). Dessa forma, a nomenclatura explicita a finalidade de cada objeto em seus respectivos contextos.

## S4 — `err` em `usuariosController`

**Onde:** `backend/src/controllers/usuariosController.js`, na função `handleError` e nos quatro blocos `catch`.

**Por que é um smell:** Trata-se de uma abreviação que quebra a padronização do projeto. Uma vez que o restante do código adota variáveis escritas por extenso em português (como `usuarioId`, `animalId`, `mensagem`), o uso isolado de `err` soa inconsistente.

**Como foi resolvido:** A variável foi renomeada para `erro` (R4).

## S5 — `count` em `deletarAnimal`

**Onde:** `backend/src/services/animaisService.js`.

**Por que é um smell:** Apresenta exatamente a mesma imprecisão descrita no caso S1, apenas inserido em uma função diferente.

**Como foi resolvido:** O termo `count` foi trocado por `quantidadeRemovida` (R5). Adotar a mesma nomenclatura nos serviços de favoritos e de animais garante uma maior coesão ao código como um todo.

## S6 — `result` e `atual` (tratados de forma oportunista)

Identificamos essas duas situações **após** a rodada inicial de refatorações, durante a elaboração dos testes de caracterização. Portanto, os detalhes completos de sua resolução constam no arquivo [03-refatoracao-oportunista.md](03-refatoracao-oportunista.md).

- **`result`** em `usuariosController.js` (`registrarUsuario` e `syncGoogleUsuario`): Armazena a resposta obtida pelo serviço de usuários. Como o nome original não expressa nada além do significado vago de "um resultado qualquer", foi substituído pelo termo em português `resultado`, adequando-se ao idioma padrão do arquivo.
- **`atual`** em `atualizarAnimal`: Refere-se ao registro do animal já existente no banco de dados e aparece 15 vezes ao longo da função. O termo isolado não especifica qual é o seu contexto exato e gera confusão por estar muito próximo à variável `dadosAtualizacao`. Para sanar a ambiguidade, a variável passou a ser chamada de `animalAtual`.

## S7 — `val` no frontend (não tratado)

**Onde:** `client/src/pages/AnimaisListPage.jsx`, nos quatro `.map(([val, label]) => ...)` que geram os botões de filtro (espécie, sexo, porte e idade).

**Por que é um smell:** O nome `val` é genérico demais para representar o código do filtro em questão (como `'GATO'`, `'MACHO'`, `'PEQUENO'`, etc.). Uma nomenclatura como `valorFiltro` comunicaria a intenção de forma muito mais objetiva.

**Situação:** Mapeado, porém **não corrigido**. Como a aplicação frontend do projeto não possui cobertura de testes automatizados, o foco desta entrega limitou-se ao backend, ambiente onde é possível garantir com segurança que a refatoração não alterou o comportamento original do sistema.

## S8 — `err` nos demais controllers (não tratado)

**Onde:** `animaisController.js`, `agendamentosController.js`, `favoritosController.js` e `authMiddleware.js` ainda usam `err`.

**Situação:** Mapeado, porém **não corrigido**. Embora a mesma solução aplicada em R4 fosse plenamente cabível aqui, a alteração desses arquivos — que já estão envolvidos em outras frentes de refatoração de outros membros da equipe — poderia elevar desnecessariamente o risco de conflitos nos *Pull Requests* (PRs).

## Conclusão

As ocorrências catalogadas de S1 a S6 foram solucionadas utilizando a técnica de Renomear Variável. Os itens S7 e S8, por sua vez, permanecem registrados como melhorias pendentes para o futuro, **não sendo contabilizados como problemas resolvidos nesta etapa**.
