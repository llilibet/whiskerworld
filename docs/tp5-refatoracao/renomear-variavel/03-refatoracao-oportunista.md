# 3. Refatoração oportunista

Segundo o capítulo 9 de *Engenharia de Software Moderna*, uma refatoração é **oportunista** quando acontece durante outra tarefa, no momento em que o desenvolvedor percebe que um trecho pode ficar melhor. Não há uma tarefa separada para ela.

## Contexto

Depois das renomeações planejadas (R1 a R5), escrevemos testes de caracterização para `animaisService` e `usuariosController` ([commit `a5f2b96`](README.md#histórico-de-commits)). Para montar os testes foi preciso ler essas duas funções com atenção, e dois nomes que tinham passado despercebidos ficaram evidentes. Como os testes já estavam prontos para proteger o código, aproveitamos para corrigi-los na hora.

Commit: `488d276` — diff completo: [diff-03-oportunista.diff](evidencias/texto/diff-03-oportunista.diff).

## O1 — `result` → `resultado` (`usuariosController.js`)

**Problema:** `result` guarda o retorno de `usuariosService.registrarUsuario` e de `usuariosService.syncGoogleUsuario`. É um nome em inglês, genérico, em um arquivo em que tudo mais está em português (`mensagem`, `erro`, `usuario`).

**Antes**

```js
const result = await usuariosService.registrarUsuario(req.body);
return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', ...result });
```

**Depois**

```js
const resultado = await usuariosService.registrarUsuario(req.body);
return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', ...resultado });
```

A mesma troca foi feita em `syncGoogleUsuario` (`res.json(result)` → `res.json(resultado)`).

## O2 — `atual` → `animalAtual` (`atualizarAnimal`)

**Problema:** depois de R3, a função ficou com `dadosAtualizacao` (o que vem na requisição) e `atual` (o que já está salvo). Escrevendo o teste "mantém os valores atuais quando nenhum dado novo é enviado", percebemos que `atual` sozinho não diz *o quê* é atual, e os dois nomes são parecidos demais.

**Antes**

```js
const atual = await animaisRepository.findById(id);
if (!atual) {
  throw new AppError('Animal não encontrado.', 404);
}
...
idade: dadosAtualizacao.idade || atual.idade,
```

**Depois**

```js
const animalAtual = await animaisRepository.findById(id);
if (!animalAtual) {
  throw new AppError('Animal não encontrado.', 404);
}
...
idade: dadosAtualizacao.idade || animalAtual.idade,
```

Foram 15 ocorrências, todas dentro de `atualizarAnimal`. As demais funções do arquivo usam `animal` e não foram alteradas.

## Como sabemos que o comportamento não mudou

Os testes de caracterização de `atualizarAnimal` (mantém valores atuais, aplica dados novos, 404 e 403) e de `registrarUsuario` e `syncGoogleUsuario` (201, erros com status, 500 padrão) cobrem exatamente o código alterado. Os resultados reais estão em [evidencias/texto/](evidencias/texto/README.md).

## Por que isso é "oportunista" e não "planejada"

- Não estava na lista de smells do diagnóstico inicial (S1 a S5).
- Surgiu no meio de outra tarefa (escrever os testes).
- Foi feita em um commit à parte, sem uma etapa própria de análise e planejamento.
