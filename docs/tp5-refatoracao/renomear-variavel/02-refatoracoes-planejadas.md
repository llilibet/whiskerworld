# Refatorações Planejadas

As aplicações da técnica **Renomear Variável (Rename Variable)** foram planejadas após a identificação de nomes genéricos ou abreviados no backend do projeto Whiskerworld.

A intenção foi melhorar a legibilidade e tornar mais explícito o significado dos identificadores, preservando as operações executadas e as regras existentes.

## R1 — `count` para `quantidadeRemovida`

**Arquivo:** `backend/src/services/favoritosService.js`.

A alteração foi planejada para deixar explícito o significado esperado do retorno da operação de remoção de um favorito. O novo nome facilita a compreensão da condição que verifica se houve remoção.

## R2 — `body` para `dadosNovoAnimal`

**Arquivo:** `backend/src/services/animaisService.js`, função `criarAnimal`.

O parâmetro foi renomeado para indicar que o objeto contém os dados utilizados no cadastro de um animal. Todas as referências ao parâmetro no escopo da função foram atualizadas.

## R3 — `body` para `dadosAtualizacao`

**Arquivo:** `backend/src/services/animaisService.js`, função `atualizarAnimal`.

A alteração torna mais clara a finalidade do objeto utilizado na atualização de um animal. As referências foram atualizadas sem a intenção de modificar as regras de atualização dos dados.

## R4 — `err` para `erro`

**Arquivo:** `backend/src/controllers/usuariosController.js`.

O identificador foi expandido para uma forma mais descritiva na função `handleError` e nos blocos `catch`. O objetivo foi melhorar a legibilidade do tratamento de exceções.

## R5 — `count` para `quantidadeRemovida`

**Arquivo:** `backend/src/services/animaisService.js`, função `deletarAnimal`.

O nome foi alterado para comunicar melhor o significado esperado do retorno da operação de remoção de um animal, mantendo a chamada ao repositório e a condição de erro.

## Preservação do comportamento

Nas cinco alterações, a intenção foi modificar os identificadores e atualizar suas referências, sem modificar as operações, as condições ou as respostas do sistema.

A comprovação de que o comportamento observável foi preservado deve ser feita por meio de testes e comparação das versões anterior e posterior. Os resultados devem ser registrados somente após a execução e verificação efetivas desses procedimentos.

