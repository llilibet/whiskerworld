# 4. Par neutro: Extract Variable (A) + Inline Variable (B)

O trabalho pede um par de refatorações **A** e **B** em que **B desfaz A**. Aplicadas em sequência, elas não têm efeito no sistema.

No catálogo de Fowler, o inverso de **Extract Variable** é **Inline Variable**: a variável é substituída pela expressão que ela guarda, em todos os lugares onde é usada, e deixa de existir. O capítulo 9 de *Engenharia de Software Moderna* apresenta as duas como operações inversas.

Isso mostra o caráter neutro da refatoração: uma refatoração apenas reorganiza o código, sem mudar o que ele faz. Se B desfaz A, o código volta exatamente ao estado inicial, e o comportamento também.

| | |
|---|---|
| **Arquivo** | `backend/src/services/agendamentosService.js` |
| **Função afetada** | `validarDataVisita` |
| **Commit anterior a A** | `ba9be83` |
| **Commit A – Extract Variable** | `125ce02` · [diff](evidencias/texto/diff-05-par-neutro-A-extract.diff) |
| **Commit B – Inline Variable** | `8f10868` · [diff](evidencias/texto/diff-06-par-neutro-B-inline.diff) |
| **Prova** | [evidencias/texto/prova-par-neutro.txt](evidencias/texto/prova-par-neutro.txt) |

---

## Estado inicial

A regra "não há visitas aos domingos" usava a expressão diretamente no `if`:

```js
function validarDataVisita(dataVisita) {
  if (!dataVisita) return;

  const data = new Date(`${dataVisita}T00:00:00`);
  if (Number.isNaN(data.getTime())) {
    throw new AppError('Data de visita inválida. Use o formato YYYY-MM-DD.', 400);
  }

  if (data.getDay() === 0) {
    throw new AppError('Agendamentos só podem ser realizados de segunda a sábado. Domingos estão indisponíveis.', 400);
  }
}
```

## Refatoração A — Extract Variable (`125ce02`)

A expressão `data.getDay() === 0` ganhou o nome `ehDomingo`. Quem lê não precisa lembrar que, no JavaScript, `getDay()` devolve `0` para domingo:

```js
  const ehDomingo = data.getDay() === 0;
  if (ehDomingo) {
    throw new AppError('Agendamentos só podem ser realizados de segunda a sábado. Domingos estão indisponíveis.', 400);
  }
```

![Diff da refatoração A](evidencias/prints/10-diff-a-extract-variable.png)

## Refatoração B — Inline Variable (`8f10868`)

A variável `ehDomingo` foi substituída de volta pela expressão `data.getDay() === 0`, no único lugar onde era usada, e a declaração foi removida. O código ficou igual ao **estado inicial**. O diff de B é o espelho do diff de A: o que A adicionou, B remove.

![Diff da refatoração B](evidencias/prints/11-diff-b-inline-variable.png)

---

## Prova de que A + B não têm efeito

O Git identifica o conteúdo de cada arquivo por um hash. Arquivos com conteúdo igual têm o mesmo hash.

```text
Hash do conteúdo (git blob) de agendamentosService.js em cada commit:
  antes de A : 4f60b9ca3d818bfa6c91e971d2f48fa05a544f3c
  depois de A: ce752c2b5c11df985b2c86ded3b6a3c867c2c6da   <- código diferente
  depois de B: 4f60b9ca3d818bfa6c91e971d2f48fa05a544f3c   <- igual ao inicial

$ git diff ba9be83 8f10868 -- backend/src/services/agendamentosService.js
(nenhuma diferença)
```

Além disso, os testes `deve rejeitar agendamento em domingo` e `deve permitir agendamento em sábado` passaram nos três estados (antes de A, depois de A e depois de B).

Execução no PowerShell. A primeira e a última hash são iguais, e o diff entre o estado antes de A e depois de B tem 0 linhas:

![Prova do par neutro](evidencias/prints/05-par-neutro-prova.png)

Para reproduzir:

```powershell
git rev-parse ba9be83:backend/src/services/agendamentosService.js
git rev-parse 125ce02:backend/src/services/agendamentosService.js
git rev-parse 8f10868:backend/src/services/agendamentosService.js
git diff ba9be83 8f10868 -- backend/src/services/agendamentosService.js
```

## Observação

As duas refatorações são válidas isoladamente. A é uma Extração de Variável legítima, porque dá nome a uma convenção pouco óbvia do JavaScript. B também se justificaria, já que a mensagem de erro logo abaixo diz que domingos estão indisponíveis e a variável é usada em um único lugar. O objetivo do par é **didático**: mostrar no próprio código que refatorações são transformações reversíveis, que preservam o comportamento. Por isso, o estado final do arquivo é igual ao inicial.
