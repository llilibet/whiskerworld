# Evidências em texto

Esta pasta guarda, em texto puro, a saída dos comandos usados como evidência da refatoração **Renomear Variável**. O conteúdo é o mesmo dos prints, mas pode ser copiado e pesquisado. Os ficheiros não foram editados: são a saída original de cada comando.

## Diffs: o que mudou no código
Um diff compara duas versões de um ficheiro e mostra só o que mudou:
- linhas a começar com `-` existiam antes e foram removidas;
- linhas a começar com `+` foram adicionadas na nova versão;
- linhas sem sinal não mudaram e aparecem só como contexto;
- linhas `@@ -28,10 +28,12 @@` indicam em que trecho do ficheiro está a mudança.

| Ficheiro | Refatoração | O que mostra |
| :--- | :--- | :--- |
| `diff-renomear-variavel.diff` | R1 (planeada) | A variável genérica `count` a ser renomeada para `quantidadeRemovida` no `favoritosService.js`. |
| `diff-s2-s3.diff` | R2 e R3 (planeadas) | A variável `body` a ser alterada para `dadosNovoAnimal` e `dadosAtualizacao` no `animaisService.js`, e a variável `err` a ser renomeada para `erro` no `usuariosController.js`. |

## Resultados: prova de que o comportamento não mudou

| Ficheiro | Comando | O que prova |
| :--- | :--- | :--- |
| `testes-antes.txt` | `npm test` com o código anterior à refatoração | Os testes passam no código original. É a nossa linha de base. |
| `testes-depois.txt` | `npm test` com o código refatorado | Os mesmos testes continuam a passar, provando que alterar os nomes das variáveis não afetou a lógica de validação ou as respostas do sistema. |
