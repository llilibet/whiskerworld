# Code smells identificados

Code smells são sinais no código de que o design pode ser melhorado. Eles não são bugs: o sistema funciona, mas fica mais difícil de entender, testar e alterar. O capítulo 9 de Engenharia de Software Moderna apresenta um catálogo desses sinais e as refatorações que costumam resolvê-los.

Analisamos os arquivos do backend e do frontend em busca de variáveis e parâmetros com nomes genéricos, confusos ou que não explicam sua intenção. Todos os casos abaixo podem ser tratados com a refatoração **Renomear Variável (Rename Variable)**.

| # Smell | Onde | Situação |
| :--- | :--- | :--- |
| S1 Nomes Misteriosos (`count`) | `backend/src/services/favoritosService.js` | Resolvido por R1 |
| S2 Nomes Genéricos (`body`) | `backend/src/services/animaisService.js` | Resolvido por R2 |
| S3 Nomes Encurtados/Siglas (`err`) | `backend/src/controllers/usuariosController.js` | Resolvido por R3 |
| S4 Nomes Misteriosos (`item`, `info`) | Páginas de listagem em `client/src` | Identificado, não tratado |

### S1 — Nomes Misteriosos em removerFavorito
**Onde:** `backend/src/services/favoritosService.js`, na função `removerFavorito`.

**Por que é um smell:** A variável `count` possui um nome genérico. Quem lê o código não sabe imediatamente o que está sendo contado. No contexto da função, o valor retornado pelo repositório representa a quantidade de registros removidos do banco de dados.

**Como foi resolvido:** A variável `count` foi renomeada para `quantidadeRemovida` (R1). Isso torna o contexto da verificação `if (!quantidadeRemovida)` muito mais claro e semântico, sem a necessidade de ler a implementação do repositório para entender. Detalhes em `02-refatoracoes-planejadas.md`.

### S2 — Nomes Genéricos em cadastros e atualizações
**Onde:** `backend/src/services/animaisService.js`, nas funções `criarAnimal` e `atualizarAnimal`.

**Por que é um smell:** É comum receber as informações do corpo da requisição em um objeto chamado simplesmente de `body`. Esse nome é genérico e não informa sobre qual entidade estamos lidando, dificultando a leitura quando a função é longa.

**Como foi resolvido:** As variáveis chamadas `body` foram renomeadas para nomes que refletem a entidade e a ação, como `dadosNovoAnimal` ou `dadosAtualizacao` (R2).

### S3 — Nomes Encurtados em blocos de erro
**Onde:** `backend/src/controllers/usuariosController.js`, dentro dos blocos `try/catch`.

**Por que é um smell:** Variáveis de erro frequentemente são chamadas apenas de `e` ou `err`. Embora seja uma convenção comum, em funções mais complexas, ter nomes excessivamente curtos pode causar confusão de escopo. 

**Como foi resolvido:** Renomeamos variáveis como `err` para nomes explícitos como `erro` (R3).

### S4 — Nomes Misteriosos em listagens do frontend (não tratado)
**Onde:** Em componentes do React (`client/src/pages/AnimaisListPage.jsx`), dentro de funções de mapeamento (`.map()`).

**Por que é um smell:** Ao renderizar listas de animais ou usuários, a variável de iteração muitas vezes é chamada de `item`, `info` ou `val`. Isso obriga o desenvolvedor a olhar o array original para saber o que aquele `item` representa.

**Situação:** O caso foi identificado, mas ficou fora desta entrega. A solução ideal seria renomear `item` para `animal` ou `usuario`. Não aplicamos agora pois focamos a refatoração no backend, onde possuímos maior cobertura de testes para garantir a estabilidade.
