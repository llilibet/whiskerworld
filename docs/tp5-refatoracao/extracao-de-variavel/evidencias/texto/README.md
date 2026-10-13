# Evidências em texto

Esta pasta guarda, em texto puro, a saída dos comandos usados como evidência da Extração de Variável. O conteúdo é o mesmo dos [prints](../prints/), mas pode ser copiado e pesquisado. Os arquivos não foram editados: são a saída original de cada comando.

## Diffs: o que mudou no código

Um **diff** compara duas versões de um arquivo e mostra só o que mudou:

- linhas começando com `-` existiam **antes** e foram removidas;
- linhas começando com `+` foram **adicionadas** na nova versão;
- linhas sem sinal não mudaram e aparecem só como contexto;
- linhas `@@ -28,10 +28,12 @@` indicam em que trecho do arquivo está a mudança (linha inicial e quantidade de linhas, antes e depois).

| Arquivo | Refatoração | O que mostra |
|---|---|---|
| [diff-01-tem-permissao.diff](diff-01-tem-permissao.diff) | R1 (planejada) | A condição com cinco negações de `verificarAcesso` sendo trocada pela variável `temPermissao` |
| [diff-02-pontuacao-compatibilidade.diff](diff-02-pontuacao-compatibilidade.diff) | R2 (planejada) | Os números 12, 10 e 6 virando `pontuacaoMaxima`, `pontuacaoMinimaAlta` e `pontuacaoMinimaMedia`, e a chamada `possuiImpedimento(respostas)` ganhando a variável `temImpedimento` |
| [diff-03-fotos-acompanhamento.diff](diff-03-fotos-acompanhamento.diff) | R3 (planejada) | `2 * 1024 * 1024`, a assinatura de bytes do PNG e `15 * 60 * 1000` virando `tamanhoMaximoFoto`, `assinaturaPng` e `validadeUrlTemporaria`, e o cálculo da expiração ganhando a variável `expiraEm` |
| [diff-04-upload-foto.diff](diff-04-upload-foto.diff) | R4 (oportunista) | Os limites do `multer` virando `tamanhoMaximoFoto` e `tamanhoMaximoCampo` |
| [diff-05-par-neutro-A-extract.diff](diff-05-par-neutro-A-extract.diff) | A (Extract Variable) | A expressão `data.getDay() === 0` ganhando o nome `ehDomingo` |
| [diff-06-par-neutro-B-inline.diff](diff-06-par-neutro-B-inline.diff) | B (Inline Variable) | O inverso exato do diff anterior: `ehDomingo` volta a ser `data.getDay() === 0` e a variável é removida |

## Resultados: prova de que o comportamento não mudou

| Arquivo | Comando | O que prova |
|---|---|---|
| [testes-antes.txt](testes-antes.txt) | `npm test` com o código **anterior** à refatoração e os testes novos | Os 36 testes passam no código original, incluindo os 7 testes de caracterização criados para esta refatoração. É a linha de base. |
| [testes-depois.txt](testes-depois.txt) | `npm test` com o código **refatorado** | Os mesmos 36 testes continuam passando: permissões, níveis de compatibilidade, limites das fotos e mensagens de erro são os mesmos. |
| [hash-compatibilidade-antes.txt](hash-compatibilidade-antes.txt) | [comparar-compatibilidade.js](../../../extracao-de-metodo/demonstracao/comparar-compatibilidade.js) com o código **anterior** | Executa `calcularCompatibilidade` com as 17.496 combinações possíveis de respostas e resume todas as saídas em um único código (hash SHA-256). |
| [hash-compatibilidade-depois.txt](hash-compatibilidade-depois.txt) | O mesmo script com o código **refatorado** | O hash é idêntico ao anterior. Isso significa que todas as 17.496 saídas são exatamente iguais, porque qualquer diferença, mesmo de uma letra, mudaria o hash. |
| [prova-par-neutro.txt](prova-par-neutro.txt) | `git rev-parse` e `git diff` nos commits do par A + B | O arquivo `agendamentosService.js` tem o mesmo hash antes de A e depois de B, e o diff entre esses dois estados é vazio. Ou seja, B desfez A por completo. |

> Nos arquivos `testes-*.txt`, cada linha `ok N - ...` é um teste que passou. O resumo final (`# pass 36`, `# fail 0`) indica o total.
