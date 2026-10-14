# Evidências em texto — Renomear Variável

Esta pasta guarda, em texto puro, a saída dos comandos usados como evidência. Os arquivos são gerados por [`demonstracao/gerar-evidencias.sh`](../../demonstracao/gerar-evidencias.sh) e **não foram editados à mão**.

## Diffs: o que mudou no código

Um **diff** compara duas versões de um arquivo e mostra só o que mudou:

- linhas começando com `-` existiam **antes** e foram removidas;
- linhas começando com `+` foram **adicionadas**;
- linhas sem sinal não mudaram e aparecem só como contexto;
- linhas `@@ -28,10 +28,12 @@` indicam onde está a mudança (linha inicial e quantidade de linhas, antes e depois).

| Arquivo | Refatoração | O que mostra |
|---|---|---|
| [diff-01-r1-favoritos.diff](diff-01-r1-favoritos.diff) | R1 (planejada) | `count` → `quantidadeRemovida` em `removerFavorito` |
| [diff-02-r2-r5-animais-usuarios.diff](diff-02-r2-r5-animais-usuarios.diff) | R2, R3, R4, R5 (planejadas) | `body` → `dadosNovoAnimal` / `dadosAtualizacao`, `err` → `erro` e `count` → `quantidadeRemovida` |
| [diff-03-oportunista.diff](diff-03-oportunista.diff) | O1, O2 (oportunistas) | `result` → `resultado` e `atual` → `animalAtual` |
| [diff-04-par-neutro-A.diff](diff-04-par-neutro-A.diff) | A (par neutro) | `quantidadeRemovida` → `totalRemovido` |
| [diff-05-par-neutro-B.diff](diff-05-par-neutro-B.diff) | B (par neutro) | O inverso exato do diff anterior |

## Resultados: prova de que o comportamento não mudou

| Arquivo | Comando | O que prova |
|---|---|---|
| [testes-antes.txt](testes-antes.txt) | `npm test` com o código **anterior** às renomeações e os testes de caracterização | A linha de base: os testes descrevem o comportamento que já existia. |
| [testes-depois.txt](testes-depois.txt) | `npm test` com o código **refatorado** | Os mesmos testes continuam passando. |
| [prova-par-neutro.txt](prova-par-neutro.txt) | `git rev-parse` e `git diff` nos commits do par A + B | O arquivo tem o mesmo hash antes de A e depois de B; o diff entre os dois é vazio. |

> Nos arquivos `testes-*.txt`, cada linha`ok N - ...` é um teste que passou. O resumo final (`# pass`, `# fail`) indica os totais.
