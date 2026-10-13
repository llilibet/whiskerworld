# Code Smells Identificados — Renomear Variável

Code smells são sinais de que a estrutura interna do código pode ser melhorada. Eles não representam necessariamente erros de execução, mas podem dificultar a leitura, a manutenção e a evolução do software.

Nesta análise, foram identificados nomes genéricos ou abreviados em variáveis e parâmetros do projeto Whiskerworld. A técnica escolhida para os casos tratados foi **Renomear Variável (Rename Variable)**.

## Resumo dos casos

| ID | Code smell | Localização | Situação |
|---|---|---|---|
| S1 | Nome misterioso (`count`) | `backend/src/services/favoritosService.js` | Resolvido por R1 |
| S2 | Nome genérico (`body`) | `backend/src/services/animaisService.js`, função `criarAnimal` | Resolvido por R2 |
| S3 | Nome genérico (`body`) | `backend/src/services/animaisService.js`, função `atualizarAnimal` | Resolvido por R3 |
| S4 | Nome abreviado (`err`) | `backend/src/controllers/usuariosController.js` | Resolvido por R4 |
| S5 | Nome misterioso (`count`) | `backend/src/services/animaisService.js`, função `deletarAnimal` | Resolvido por R5 |
| S6 | Nome genérico (`val`) | `client/src/pages/AnimaisListPage.jsx` | Identificado, não tratado nesta etapa |

## S1 — Nome misterioso em `removerFavorito`

**Localização:** `backend/src/services/favoritosService.js`, função `removerFavorito`.

**Problema:** A variável `count` não informa claramente o significado do valor retornado pela operação de remoção.

**Refatoração aplicada:** O nome foi alterado para `quantidadeRemovida`, deixando mais claro o significado esperado do valor utilizado na condição `if`.

**Resultado esperado:** Maior legibilidade sem alteração da operação de remoção ou da condição de erro.

## S2 — Nome genérico em `criarAnimal`

**Localização:** `backend/src/services/animaisService.js`, função `criarAnimal`.

**Problema:** O parâmetro `body` não informa qual entidade está sendo cadastrada.

**Refatoração aplicada:** O parâmetro foi renomeado para `dadosNovoAnimal`, e suas referências no escopo da função foram atualizadas.

**Resultado esperado:** Facilitar a identificação dos dados utilizados no cadastro de um animal.

## S3 — Nome genérico em `atualizarAnimal`

**Localização:** `backend/src/services/animaisService.js`, função `atualizarAnimal`.

**Problema:** O nome `body` não evidencia que o objeto contém dados destinados à atualização de um animal.

**Refatoração aplicada:** O parâmetro foi renomeado para `dadosAtualizacao`, com atualização de suas referências no escopo da função.

**Resultado esperado:** Tornar o código mais compreensível durante a manutenção da rotina de atualização.

## S4 — Nome abreviado no tratamento de erros

**Localização:** `backend/src/controllers/usuariosController.js`.

**Problema:** O identificador `err` é uma abreviação que pode tornar a leitura menos clara, especialmente quando aparece em diversos blocos de tratamento de exceções.

**Refatoração aplicada:** O nome foi alterado para `erro` na função `handleError` e nos blocos `catch` correspondentes.

**Resultado esperado:** Melhorar a clareza do tratamento de exceções, preservando a lógica de registro e resposta dos erros.

## S5 — Nome misterioso em `deletarAnimal`

**Localização:** `backend/src/services/animaisService.js`, função `deletarAnimal`.

**Problema:** O nome `count` não comunica claramente o significado do retorno da operação de remoção de um animal.

**Refatoração aplicada:** A variável foi renomeada para `quantidadeRemovida`.

**Resultado esperado:** Tornar a condição de verificação mais expressiva e consistente com o significado esperado do retorno.

## S6 — Nome genérico em filtros do frontend

**Localização:** `client/src/pages/AnimaisListPage.jsx`, nos arrays utilizados para gerar filtros com `.map()`.

**Problema:** O parâmetro `val` é genérico e não descreve claramente o papel dos valores utilizados nos filtros de espécie, sexo, porte e idade.

**Situação:** O problema foi identificado, mas não foi tratado nesta etapa, que priorizou as renomeações no backend.

**Possível melhoria futura:** Avaliar a substituição de `val` por um nome mais descritivo, como `valorFiltro`, atualizando todas as referências dentro dos respectivos callbacks. Essa mudança deve ser validada antes de ser considerada concluída.

## Conclusão

Os casos S1 a S5 foram tratados por meio da técnica Renomear Variável. O caso S6 permanece identificado como oportunidade de melhoria futura e não deve ser apresentado como resolvido.

A confirmação de preservação do comportamento depende da validação das alterações por meio de testes e da comparação entre as versões anterior e posterior.

