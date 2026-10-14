# 2. Refatorações planejadas

Segundo o capítulo 9 de *Engenharia de Software Moderna*, uma refatoração é **planejada** quando é tratada como uma tarefa própria, e não como um ajuste feito no meio de outra tarefa. As cinco renomeações abaixo (R1 a R5) foram feitas assim:

1. **Diagnóstico:** procuramos nomes genéricos (`count`, `body`, `err`) em `backend/src` (smells S1 a S5 em [01-code-smells.md](01-code-smells.md)).
2. **Execução:** uma renomeação por vez, trocando o nome na declaração e em todas as referências dentro do escopo da função.
3. **Verificação:** `git diff` para conferir que só os identificadores mudaram e testes automatizados antes e depois. Os testes de `favoritosService`, `animaisService` (criar, atualizar, remover) e `usuariosController` foram escritos para esta entrega, porque essas partes não tinham testes. Veja [README.md](README.md#como-garantimos-que-o-comportamento-não-mudou).

| ID | De → Para | Arquivo | Commit | Diff |
|---|---|---|---|---|
| R1 | `count` → `quantidadeRemovida` | `favoritosService.js` | `93bbe26` | [diff-01](evidencias/texto/diff-01-r1-favoritos.diff) |
| R2 | `body` → `dadosNovoAnimal` | `animaisService.js` (`criarAnimal`) | `b888838` | [diff-02](evidencias/texto/diff-02-r2-r5-animais-usuarios.diff) |
| R3 | `body` → `dadosAtualizacao` | `animaisService.js` (`atualizarAnimal`) | `b888838` | [diff-02](evidencias/texto/diff-02-r2-r5-animais-usuarios.diff) |
| R4 | `err` → `erro` | `usuariosController.js` | `b888838` | [diff-02](evidencias/texto/diff-02-r2-r5-animais-usuarios.diff) |
| R5 | `count` → `quantidadeRemovida` | `animaisService.js` (`deletarAnimal`) | `b888838` | [diff-02](evidencias/texto/diff-02-r2-r5-animais-usuarios.diff) |

---

## R1 — `count` → `quantidadeRemovida`

**Justificativa:** A operação de exclusão de um favorito devolve o total de registros apagados. O termo genérico `count` torna a validação do erro 404 pouco intuitiva. Ao utilizar `quantidadeRemovida`, a interpretação da lógica torna-se imediata: "se nenhuma quantidade foi removida, infere-se que o favorito não existia".

**Antes**

```js
const count = await favoritosRepository.remove(usuarioId, animalId);
if (!count) {
  throw new AppError('Favorito não encontrado.', 404);
}
```

**Depois**

```js
const quantidadeRemovida = await favoritosRepository.remove(usuarioId, animalId);
if (!quantidadeRemovida) {
  throw new AppError('Favorito não encontrado.', 404);
}
```

## R2 — `body` → `dadosNovoAnimal`

**Justificativa:** A função `criarAnimal` é responsável por validar o nome, verificar campos obrigatórios, processar o status de `vacinado` e estruturar o objeto que será persistido no repositório. O parâmetro transita por todas essas etapas. A nova nomenclatura expressa com clareza a real finalidade desse objeto ao longo de todo o fluxo.

**Antes**

```js
async function criarAnimal(body, arquivo) {
  const { nome, sexo, tipo, idade, porte, descricao } = body;
  ...
  if (!body.historico) camposFaltando.push('histórico');
  ...
  return animaisRepository.create({
    ...body,
    nome: nomeAnimal,
    tipo: (body.tipo || '').toUpperCase(),
    sexo: (body.sexo || '').toUpperCase(),
    cadastradoPor: body.cadastradoPor || null,
  });
}
```

**Depois**

```js
async function criarAnimal(dadosNovoAnimal, arquivo) {
  const { nome, sexo, tipo, idade, porte, descricao } = dadosNovoAnimal;
  ...
  if (!dadosNovoAnimal.historico) camposFaltando.push('histórico');
  ...
  return animaisRepository.create({
    ...dadosNovoAnimal,
    nome: nomeAnimal,
    tipo: (dadosNovoAnimal.tipo || '').toUpperCase(),
    sexo: (dadosNovoAnimal.sexo || '').toUpperCase(),
    cadastradoPor: dadosNovoAnimal.cadastradoPor || null,
  });
}
```

## R3 — `body` → `dadosAtualizacao`

**Justificativa:** em `atualizarAnimal` o objeto contém só os campos que o administrador quer mudar; os demais mantêm o valor atual. `dadosAtualizacao` deixa isso claro e evita confundir com o animal já salvo.

**Antes**

```js
async function atualizarAnimal(id, body, arquivo, adminId) {
  ...
  const nomeAnimal = body.nome !== undefined ? validarNomeAnimal(body.nome) : atual.nome;
  ...
    idade: body.idade || atual.idade,
    descricao: body.descricao !== undefined ? body.descricao : atual.descricao,
  ...
}
```

**Depois**

```js
async function atualizarAnimal(id, dadosAtualizacao, arquivo, adminId) {
  ...
  const nomeAnimal = dadosAtualizacao.nome !== undefined ? validarNomeAnimal(dadosAtualizacao.nome) : atual.nome;
  ...
    idade: dadosAtualizacao.idade || atual.idade,
    descricao: dadosAtualizacao.descricao !== undefined ? dadosAtualizacao.descricao : atual.descricao,
  ...
}
```

> Nesta etapa a variável `atual` ainda não tinha sido renomeada. Isso foi feito depois, de forma oportunista (ver [03-refatoracao-oportunista.md](03-refatoracao-oportunista.md)).

## R4 — `err` → `erro`

**Justificativa:** deixar o tratamento de erros no padrão de nomes por extenso do restante do código.

**Antes**

```js
function handleError(res, err) {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({ mensagem: err.message || 'Erro interno.' });
}
...
  } catch (err) { return handleError(res, err); }
```

**Depois**

```js
function handleError(res, erro) {
  console.error(erro);
  const status = erro.status || 500;
  return res.status(status).json({ mensagem: erro.message || 'Erro interno.' });
}
...
  } catch (erro) { return handleError(res, erro); }
```

## R5 — `count` → `quantidadeRemovida` em `deletarAnimal`

**Justificativa:** mesmo motivo de R1, aplicado à remoção de animais.

**Antes**

```js
const count = await animaisRepository.remove(id);
if (!count) {
  throw new AppError('Animal não encontrado.', 404);
}
```

**Depois**

```js
const quantidadeRemovida = await animaisRepository.remove(id);
if (!quantidadeRemovida) {
  throw new AppError('Animal não encontrado.', 404);
}
```

---

## O que não mudou

Nas cinco refatorações, as chamadas aos repositórios, as condições `if`, os códigos HTTP e as mensagens de erro ficaram idênticos. Mudaram apenas nomes de variáveis locais e de parâmetros. Nenhum `module.exports` foi alterado, então controllers, rotas e frontend continuam funcionando sem nenhuma mudança.
