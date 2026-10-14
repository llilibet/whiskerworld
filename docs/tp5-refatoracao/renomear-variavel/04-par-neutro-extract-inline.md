# 4. Par neutro (refatorações A e B que se cancelam)

O TP5 pede um **par de refatorações A e B** em que B desfaz as transformações de A, sem impacto no sistema.

## Par principal da equipe

O par principal da equipe é **Extração de Método (A) + Método em Linha (B)**, documentado em [`../extracao-de-metodo/04-par-neutro-extract-inline.md`](../extracao-de-metodo/04-par-neutro-extract-inline.md). A Extração de Variável também tem seu par ([`../extracao-de-variavel/04-par-neutro-extract-inline.md`](../extracao-de-variavel/04-par-neutro-extract-inline.md)).

## Par da técnica Renomear Variável

Renomear Variável também tem um par neutro natural: **renomear de X para Y (A) e depois de Y para X (B)**. Aplicamos o par em `removerFavorito`:

| Passo | Refatoração | Commit |
|---|---|---|
| A | `quantidadeRemovida` → `totalRemovido` | `11c6d59` |
| B | `totalRemovido` → `quantidadeRemovida` | `f2c0e9f` |

**Depois de A** (diff: [diff-04-par-neutro-A.diff](evidencias/texto/diff-04-par-neutro-A.diff))

```js
const totalRemovido = await favoritosRepository.remove(usuarioId, animalId);
if (!totalRemovido) {
  throw new AppError('Favorito não encontrado.', 404);
}
```

**Depois de B** (diff: [diff-05-par-neutro-B.diff](evidencias/texto/diff-05-par-neutro-B.diff)), idêntico ao código antes de A

```js
const quantidadeRemovida = await favoritosRepository.remove(usuarioId, animalId);
if (!quantidadeRemovida) {
  throw new AppError('Favorito não encontrado.', 404);
}
```

## Prova

O Git identifica cada versão de um arquivo por um hash do conteúdo. O arquivo `favoritosService.js` tem o **mesmo hash antes de A e depois de B** (`3cbabded…`), e o `git diff` entre os dois estados é vazio. Ou seja, B desfez A por completo. A saída real dos comandos está em [evidencias/texto/prova-par-neutro.txt](evidencias/texto/prova-par-neutro.txt).

Os testes de `removerFavorito` (4 testes) também passam nas duas versões, A e B.

## Observação

Este par é simples de propósito: Renomear Variável é inversa de si mesma. Para mostrar um par entre técnicas diferentes, que muda a estrutura do código, veja o par Extract Method / Inline Method da equipe.
