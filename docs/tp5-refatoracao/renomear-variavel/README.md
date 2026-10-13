# Refatoração: Renomear Variável (Rename Variable)

Este diretório documenta a aplicação da técnica **Renomear Variável (Rename Variable)** no projeto Whiskerworld, como parte do Trabalho Prático 5 — Refatoração.

A técnica consiste em alterar o nome de uma variável ou parâmetro para tornar sua finalidade mais clara, sem modificar o comportamento observável do sistema.

## 1. Resumo das refatorações

Foram identificados nomes genéricos ou pouco descritivos em funções do backend. As alterações buscaram melhorar a legibilidade e facilitar a manutenção do código.

| ID | Nome anterior | Nome novo | Arquivo | Classificação |
|---|---|---|---|---|
| R1 | `count` | `quantidadeRemovida` | `backend/src/services/favoritosService.js` | Planejada |
| R2 | `body` | `dadosNovoAnimal` | `backend/src/services/animaisService.js` | Planejada |
| R3 | `body` | `dadosAtualizacao` | `backend/src/services/animaisService.js` | Planejada |
| R4 | `err` | `erro` | `backend/src/controllers/usuariosController.js` | Planejada |
| R5 | `count` | `quantidadeRemovida` | `backend/src/services/animaisService.js` | Planejada |

As refatorações foram realizadas por meio da substituição dos identificadores e da atualização de suas referências nos respectivos escopos. As chamadas aos repositórios, as condições de validação e as respostas do sistema foram mantidas.

## 2. Evidências de antes e depois

### R1 — Renomeação de `count` para `quantidadeRemovida`

**Arquivo:** `backend/src/services/favoritosService.js`

**Code smell:** Nome Misterioso (*Mysterious Name*).

**Antes:**

```javascript
const count = await favoritosRepository.remove(usuarioId, animalId);

if (!count) {
  throw new AppError('Favorito não encontrado.', 404);
}
```

**Depois:**

```javascript
const quantidadeRemovida = await favoritosRepository.remove(usuarioId, animalId);

if (!quantidadeRemovida) {
  throw new AppError('Favorito não encontrado.', 404);
}
```

**Justificativa:** O nome `count` não explica claramente o significado do valor retornado pelo repositório. O nome `quantidadeRemovida` torna explícito que o valor representa a quantidade de registros removidos.

**Comportamento esperado:** A operação de remoção e a condição de erro permanecem iguais. A mudança tem como objetivo melhorar a compreensão do código.

**Evidência:** `evidencias/diff-renomear-variavel.diff`.

### R2 — Renomeação de `body` para `dadosNovoAnimal`

**Arquivo:** `backend/src/services/animaisService.js`

**Code smell:** Nome Genérico.

**Antes:**

```javascript
async function criarAnimal(body, arquivo) {
  const { nome, sexo, tipo, idade, porte, descricao } = body;

  if (!body.historico) {
    camposFaltando.push('histórico');
  }

  const vacinado =
    body.vacinado === '1' ||
    body.vacinado === 'true' ||
    body.vacinado === true;

  return animaisRepository.create({
    ...body,
    nome: nomeAnimal,
    vacinado,
    foto_url,
    tipo: (body.tipo || '').toUpperCase(),
    sexo: (body.sexo || '').toUpperCase(),
    cadastradoPor: body.cadastradoPor || null,
  });
}
```

**Depois:**

```javascript
async function criarAnimal(dadosNovoAnimal, arquivo) {
  const { nome, sexo, tipo, idade, porte, descricao } = dadosNovoAnimal;

  if (!dadosNovoAnimal.historico) {
    camposFaltando.push('histórico');
  }

  const vacinado =
    dadosNovoAnimal.vacinado === '1' ||
    dadosNovoAnimal.vacinado === 'true' ||
    dadosNovoAnimal.vacinado === true;

  return animaisRepository.create({
    ...dadosNovoAnimal,
    nome: nomeAnimal,
    vacinado,
    foto_url,
    tipo: (dadosNovoAnimal.tipo || '').toUpperCase(),
    sexo: (dadosNovoAnimal.sexo || '').toUpperCase(),
    cadastradoPor: dadosNovoAnimal.cadastradoPor || null,
  });
}
```

**Justificativa:** O parâmetro `body` é genérico. `dadosNovoAnimal` indica que o objeto contém os dados usados no cadastro de um animal.

**Comportamento esperado:** As propriedades acessadas, os dados enviados ao repositório e as validações permanecem iguais.

### R3 — Renomeação de `body` para `dadosAtualizacao`

**Arquivo:** `backend/src/services/animaisService.js`

**Code smell:** Nome Genérico.

**Antes:**

```javascript
async function atualizarAnimal(id, body, arquivo, adminId) {
  const nomeAnimal =
    body.nome !== undefined
      ? validarNomeAnimal(body.nome)
      : atual.nome;

  const foto_url = arquivo
    ? await salvarFotoNoStorage(arquivo, nomeAnimal)
    : (body.foto_url || atual.foto_url);

  const vacinado =
    body.vacinado !== undefined
      ? body.vacinado == '1' || body.vacinado === true
      : atual.vacinado;

  await animaisRepository.update(id, {
    nome: nomeAnimal,
    idade: body.idade || atual.idade,
    sexo: (body.sexo || atual.sexo).toUpperCase(),
    vacinado,
    status: (body.status || atual.status).toUpperCase(),
    tipo: (body.tipo || atual.tipo).toUpperCase(),
    descricao: body.descricao !== undefined ? body.descricao : atual.descricao,
    raca: body.raca !== undefined ? body.raca : atual.raca,
    porte: body.porte !== undefined ? body.porte : atual.porte,
    historico: body.historico !== undefined ? body.historico : atual.historico,
    foto_url,
  });
}
```

**Depois:**

```javascript
async function atualizarAnimal(id, dadosAtualizacao, arquivo, adminId) {
  const nomeAnimal =
    dadosAtualizacao.nome !== undefined
      ? validarNomeAnimal(dadosAtualizacao.nome)
      : atual.nome;

  const foto_url = arquivo
    ? await salvarFotoNoStorage(arquivo, nomeAnimal)
    : (dadosAtualizacao.foto_url || atual.foto_url);

  const vacinado =
    dadosAtualizacao.vacinado !== undefined
      ? dadosAtualizacao.vacinado == '1' || dadosAtualizacao.vacinado === true
      : atual.vacinado;

  await animaisRepository.update(id, {
    nome: nomeAnimal,
    idade: dadosAtualizacao.idade || atual.idade,
    sexo: (dadosAtualizacao.sexo || atual.sexo).toUpperCase(),
    vacinado,
    status: (dadosAtualizacao.status || atual.status).toUpperCase(),
    tipo: (dadosAtualizacao.tipo || atual.tipo).toUpperCase(),
    descricao: dadosAtualizacao.descricao !== undefined ? dadosAtualizacao.descricao : atual.descricao,
    raca: dadosAtualizacao.raca !== undefined ? dadosAtualizacao.raca : atual.raca,
    porte: dadosAtualizacao.porte !== undefined ? dadosAtualizacao.porte : atual.porte,
    historico: dadosAtualizacao.historico !== undefined ? dadosAtualizacao.historico : atual.historico,
    foto_url,
  });
}
```

**Justificativa:** O novo nome descreve a finalidade do parâmetro, que é representar os dados recebidos para a atualização de um animal.

**Comportamento esperado:** A lógica de atualização e as regras para preservar valores existentes permanecem iguais.

### R4 — Renomeação de `err` para `erro`

**Arquivo:** `backend/src/controllers/usuariosController.js`

**Code smell:** Nome Abreviado.

**Antes:**

```javascript
function handleError(res, err) {
  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({
    mensagem: err.message || 'Erro interno.'
  });
}
```

**Depois:**

```javascript
function handleError(res, erro) {
  console.error(erro);
  const status = erro.status || 500;
  return res.status(status).json({
    mensagem: erro.message || 'Erro interno.'
  });
}
```

Nos blocos `catch` do mesmo arquivo, o parâmetro também foi renomeado:

**Antes:**

```javascript
} catch (err) {
  return handleError(res, err);
}
```

**Depois:**

```javascript
} catch (erro) {
  return handleError(res, erro);
}
```

**Justificativa:** O nome `erro` é mais explícito do que `err` e facilita a leitura do tratamento de exceções.

**Comportamento esperado:** O registro do erro, a definição do status HTTP e a resposta JSON continuam com a mesma lógica.

### R5 — Renomeação de `count` para `quantidadeRemovida` em `deletarAnimal`

**Arquivo:** `backend/src/services/animaisService.js`

**Code smell:** Nome Misterioso.

**Antes:**

```javascript
const count = await animaisRepository.remove(id);

if (!count) {
  throw new AppError('Animal não encontrado.', 404);
}
```

**Depois:**

```javascript
const quantidadeRemovida = await animaisRepository.remove(id);

if (!quantidadeRemovida) {
  throw new AppError('Animal não encontrado.', 404);
}
```

**Justificativa:** Assim como no caso R1, o nome anterior não deixava claro o significado do valor retornado pelo repositório. O novo identificador torna explícito o significado esperado da variável no contexto da exclusão.

**Comportamento esperado:** A chamada ao repositório e a condição que produz o erro permanecem iguais.

**Observação:** R5 é um caso adicional da mesma técnica, e não uma quinta técnica de refatoração.

## 3. Evidências complementares

Os diffs das alterações estão disponíveis em:

- `evidencias/diff-renomear-variavel.diff`: alteração de R1.
- `evidencias/diff-s2-s3.diff`: alterações de R2, R3, R4 e R5.

Esses arquivos permitem visualizar as linhas removidas e adicionadas.

Os resultados dos testes antes e depois deverão ser documentados separadamente, utilizando execuções verificáveis. Não se deve afirmar que os testes passaram sem apresentar os resultados reais.

## 4. Conclusão

A técnica Renomear Variável foi aplicada para tornar os nomes de variáveis e parâmetros mais descritivos nos serviços de favoritos e animais e no controlador de usuários.

As mudanças apresentadas alteram os identificadores e suas referências, sem modificar intencionalmente as operações, as condições ou as respostas associadas a esses trechos.

A confirmação de que o comportamento externo foi preservado depende da execução dos testes e da comparação entre as versões anterior e posterior.

