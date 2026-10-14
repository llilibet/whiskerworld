# 1. Code smells identificados

Segundo o capítulo 9 de *Engenharia de Software Moderna*, *code smells* são sinais no código de que o design pode ser melhorado. Eles não são bugs: o sistema funciona, mas fica mais difícil de ler, testar e alterar.

Todos os casos abaixo pertencem ao mesmo grupo, **Nomes Misteriosos** (*Mysterious Name*, no catálogo de Fowler): o nome da variável não diz o que ela guarda. A refatoração que resolve esse smell é **Renomear Variável** (*Rename Variable*).

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

**Por que é um smell:** `count` é um nome genérico. Quem lê `if (!count)` precisa descobrir no repositório que o valor é o número de favoritos removidos (`favoritosRepository.remove` devolve `snap.size`, ou `0` quando não achou nada).

**Como foi resolvido:** a variável virou `quantidadeRemovida` (R1). Agora a condição `if (!quantidadeRemovida)` se lê como "se nada foi removido".

## S2 e S3 — `body` em `criarAnimal` e `atualizarAnimal`

**Onde:** `backend/src/services/animaisService.js`.

**Por que é um smell:** `body` descreve *de onde* o dado veio (o corpo da requisição HTTP), não *o que ele é*. As duas funções são longas, e o nome `body` aparece 10 vezes em `criarAnimal` e 19 em `atualizarAnimal`, sem dizer se o objeto é um animal novo ou uma atualização.

**Como foi resolvido:** `body` virou `dadosNovoAnimal` em `criarAnimal` (R2) e `dadosAtualizacao` em `atualizarAnimal` (R3). Cada nome agora diz a finalidade do objeto naquela função.

## S4 — `err` em `usuariosController`

**Onde:** `backend/src/controllers/usuariosController.js`, na função `handleError` e nos quatro blocos `catch`.

**Por que é um smell:** `err` é uma abreviação. O resto do código do projeto usa nomes por extenso em português (`usuarioId`, `animalId`, `mensagem`), e `err` destoa desse padrão.

**Como foi resolvido:** `err` virou `erro` (R4).

## S5 — `count` em `deletarAnimal`

**Onde:** `backend/src/services/animaisService.js`.

**Por que é um smell:** é o mesmo problema de S1 em outra função.

**Como foi resolvido:** `count` virou `quantidadeRemovida` (R5). Usar o mesmo nome em `favoritosService` e `animaisService` deixa as duas funções consistentes.

## S6 — `result` e `atual` (tratados de forma oportunista)

Estes dois casos foram vistos **depois** das renomeações principais, enquanto escrevíamos os testes de caracterização. Por isso estão documentados em [03-refatoracao-oportunista.md](03-refatoracao-oportunista.md).

- **`result`** em `usuariosController.js` (`registrarUsuario` e `syncGoogleUsuario`): guarda o retorno do serviço de usuários. O nome não diz nada além de "é um resultado". Virou `resultado`, que também segue o padrão de nomes em português do arquivo.
- **`atual`** em `atualizarAnimal`: é o animal que já está salvo, usado 15 vezes na função. Sozinho, "atual" não diz atual *de quê*, e fica perto de `dadosAtualizacao`, o que confunde. Virou `animalAtual`.

## S7 — `val` no frontend (não tratado)

**Onde:** `client/src/pages/AnimaisListPage.jsx`, nos quatro `.map(([val, label]) => ...)` que geram os botões de filtro (espécie, sexo, porte e idade).

**Por que é um smell:** `val` é genérico; o valor é o código do filtro (`'GATO'`, `'MACHO'`, `'PEQUENO'`, ...). Um nome como `valorFiltro` seria mais claro.

**Situação:** identificado e **não tratado**. O frontend não tem testes automatizados, e esta entrega priorizou o backend, onde dá para provar a preservação do comportamento.

## S8 — `err` nos demais controllers (não tratado)

**Onde:** `animaisController.js`, `agendamentosController.js`, `favoritosController.js` e `authMiddleware.js` ainda usam `err`.

**Situação:** identificado e **não tratado**. A mesma renomeação de R4 se aplicaria, mas esses arquivos pertencem a outras refatorações da equipe, e mexer neles aumentaria o risco de conflito entre os PRs.

## Conclusão

Os casos S1 a S6 foram tratados com Renomear Variável. S7 e S8 ficam registrados como oportunidades futuras e **não são apresentados como resolvidos**.
