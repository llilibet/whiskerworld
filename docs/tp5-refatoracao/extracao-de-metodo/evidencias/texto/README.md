# Evidências em texto

Esta pasta guarda, em texto puro, a saída dos comandos usados como evidência da Extração de Método. O conteúdo é o mesmo dos [prints](../prints/), mas pode ser copiado e pesquisado. Os arquivos não foram editados: são a saída original de cada comando.

## Diffs: o que mudou no código

Um **diff** compara duas versões de um arquivo e mostra só o que mudou:

- linhas começando com `-` existiam **antes** e foram removidas;
- linhas começando com `+` foram **adicionadas** na nova versão;
- linhas sem sinal não mudaram e aparecem só como contexto;
- linhas `@@ -47,32 +47,38 @@` indicam em que trecho do arquivo está a mudança (linha inicial e quantidade de linhas, antes e depois).

| Arquivo | Refatoração | O que mostra |
|---|---|---|
| [diff-01-compatibilidade.diff](diff-01-compatibilidade.diff) | R1 (planejada) | `calcularCompatibilidade` sendo dividido em `validarRespostas`, `calcularPontuacao`, `possuiImpedimento`, `definirNivel` e `gerarOrientacoes` |
| [diff-02-registrar-usuario.diff](diff-02-registrar-usuario.diff) | R2 (planejada) | `registrarUsuario` sendo dividido em `validarDadosCadastro`, `garantirEmailDisponivel`, `salvarDocumentoUsuario` e `traduzirErroCriacaoConta`, com os comentários de bloco substituídos por nomes de métodos |
| [diff-03-normalizar-tipo-usuario.diff](diff-03-normalizar-tipo-usuario.diff) | R3 (oportunista) | A expressão duplicada `(tipo \|\| 'ADOTANTE').toUpperCase()` sendo trocada por `normalizarTipoUsuario(tipo)` em dois lugares |
| [diff-04-par-neutro-A-extract.diff](diff-04-par-neutro-A-extract.diff) | A (Extract Method) | A validação da descrição saindo de `registrarAcompanhamento` para o novo método `validarDescricao` |
| [diff-05-par-neutro-B-inline.diff](diff-05-par-neutro-B-inline.diff) | B (Inline Method) | O inverso exato do diff anterior: o corpo de `validarDescricao` volta para onde estava e o método é removido |

## Resultados: prova de que o comportamento não mudou

| Arquivo | Comando | O que prova |
|---|---|---|
| [testes-antes.txt](testes-antes.txt) | `npm test` com o código **anterior** à refatoração | Os 29 testes passam no código original. É a linha de base. |
| [testes-depois.txt](testes-depois.txt) | `npm test` com o código **refatorado** | Os mesmos 29 testes continuam passando: as respostas, mensagens de erro e dados gravados são os mesmos. |
| [hash-compatibilidade-antes.txt](hash-compatibilidade-antes.txt) | [comparar-compatibilidade.js](../../demonstracao/comparar-compatibilidade.js) com o código **anterior** | Executa `calcularCompatibilidade` com as 17.496 combinações possíveis de respostas e resume todas as saídas em um único código (hash SHA-256). |
| [hash-compatibilidade-depois.txt](hash-compatibilidade-depois.txt) | O mesmo script com o código **refatorado** | O hash é idêntico ao anterior. Isso significa que todas as 17.496 saídas são exatamente iguais, porque qualquer diferença, mesmo de uma letra, mudaria o hash. |
| [prova-par-neutro.txt](prova-par-neutro.txt) | `git rev-parse` e `git diff` nos commits do par A + B | O arquivo `acompanhamentosService.js` tem o mesmo hash antes de A e depois de B, e o diff entre esses dois estados é vazio. Ou seja, B desfez A por completo. |

> Nos arquivos `testes-*.txt`, cada linha `ok N - ...` é um teste que passou. O resumo final (`# pass 29`, `# fail 0`) indica o total.
