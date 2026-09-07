# Relatório Final — Manutenção Preventiva

## 1. Identificação da intervenção

Este relatório apresenta a intervenção de manutenção preventiva realizada no sistema **Whiskerworld**, como parte da disciplina de Manutenção e Integração de Software.

O objetivo da atividade foi identificar antecipadamente uma característica da implementação que pudesse dificultar uma mudança futura plausível e realizar uma intervenção capaz de reduzir esse esforço, preservando o comportamento funcional existente.

A intervenção consistiu na **centralização da criação dos erros controlados do backend por meio da classe `AppError`**.

---

## 2. Situação encontrada e problema de manutenibilidade

Antes da intervenção, diferentes serviços do backend criavam diretamente objetos da classe nativa `Error` e atribuíam manualmente a propriedade `status`.

O padrão utilizado era semelhante ao seguinte:

```js
const err = new Error('Animal não encontrado.');
err.status = 404;
throw err;
```

Esse padrão estava presente nos seguintes serviços:

- `backend/src/services/animaisService.js`
- `backend/src/services/agendamentosService.js`
- `backend/src/services/usuariosService.js`
- `backend/src/services/favoritosService.js`

Embora o comportamento funcional estivesse correto, a responsabilidade pela criação e configuração dos erros controlados estava distribuída entre diferentes componentes. Dessa forma, uma futura alteração na estrutura comum desses erros poderia exigir a análise e modificação de vários pontos do backend, aumentando o esforço de manutenção e o risco de inconsistências.

O diagnóstico detalhado do problema foi registrado em:

[`diagnostico-manutencao-preventiva.md`](./diagnostico-manutencao-preventiva.md)

---

## 3. Mudança futura utilizada como referência

A mudança futura considerada foi a possível necessidade de **ampliar e padronizar a estrutura dos erros controlados retornados pela API**.

Futuramente, poderia ser necessário acrescentar informações comuns aos erros, como código interno, categoria, origem ou outros detalhes. Por exemplo:

```json
{
  "status": 404,
  "code": "ANIMAL_NOT_FOUND",
  "message": "Animal não encontrado."
}
```

Na estrutura original, uma evolução desse tipo exigiria localizar os diferentes pontos responsáveis pela criação dos erros e verificar individualmente cada implementação. A manutenção preventiva buscou reduzir essa dificuldade antes que essa mudança fosse necessária.

---

## 4. Justificativa e técnica utilizada

A alteração não teve como objetivo corrigir uma falha funcional existente. O tratamento de erros do Whiskerworld já funcionava, mas sua implementação apresentava repetição e distribuição de responsabilidades que poderiam dificultar futuras evoluções.

Por esse motivo, foi criada uma abstração específica para concentrar os aspectos comuns da criação dos erros controlados. A intervenção utiliza principalmente os conceitos de **ocultamento de informação** e **separação de responsabilidades**, mantendo nos serviços apenas as regras de negócio e as situações em que cada erro deve ser lançado.

A solução caracteriza-se como **manutenção preventiva** porque atua antecipadamente sobre uma dificuldade de evolução, reduzindo o esforço e o risco associados a mudanças futuras.

---

## 5. Solução e implementação

Foi criada a classe:

`backend/src/errors/AppError.js`

Sua implementação centraliza propriedades comuns dos erros controlados:

```js
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

module.exports = AppError;
```

Com essa alteração, o padrão anterior:

```js
const err = new Error('Animal não encontrado.');
err.status = 404;
throw err;
```

passou a ser substituído por:

```js
throw new AppError('Animal não encontrado.', 404);
```

A intervenção foi desenvolvida na branch:

`fix/centralizar-erros-aplicacao`

Foram refatorados os seguintes serviços:

- `backend/src/services/animaisService.js`
- `backend/src/services/agendamentosService.js`
- `backend/src/services/usuariosService.js`
- `backend/src/services/favoritosService.js`

Também foram adicionados:

- `backend/src/errors/AppError.js`
- `backend/tests/AppError.test.js`

Após a implementação, foi aberto o **Pull Request #33**, relacionado à **Issue #31**. A alteração foi revisada, validada e posteriormente integrada à branch `main`.

---

## 6. Evidência do Estado Inicial — ANTES

Antes da implementação, foi registrado o estado original da estrutura de tratamento de erros do backend.

A evidência mostrou que os erros controlados eram criados manualmente em diferentes serviços e que a propriedade `.status` era atribuída individualmente em cada ponto.

### Vídeo 1 — Estado Inicial

🎥 [Vídeo — Evidência do Estado Inicial (ANTES)](./videos/video-1-antes.mp4)

O vídeo apresenta os arquivos e trechos de código do estado original e demonstra como essa estrutura poderia dificultar futuras alterações na padronização dos erros da API.

A evidência também foi registrada na **Issue #31**.

---

## 7. Evidência do Estado Final — DEPOIS

Após a implementação, foi realizada a validação do estado final utilizando o mesmo contexto apresentado na evidência inicial.

O vídeo demonstra a classe `AppError`, sua utilização nos serviços refatorados, a eliminação do padrão anterior e a execução dos testes após a intervenção.

### Vídeo 2 — Estado Final

🎥 [Vídeo — Validação do Estado Final (DEPOIS)](./videos/video-2-depois.mp4)

A evidência também foi registrada na **Issue #31**, permitindo a comparação direta entre os estados **ANTES** e **DEPOIS**.

---

## 8. Validação da melhoria estrutural

Para verificar se o padrão anterior continuava presente nos serviços, foi executado o seguinte comando:

```powershell
Get-ChildItem backend/src/services -Filter *.js |
  Select-String -Pattern 'new Error|\.status\s*=(?!=)'
```

Após a intervenção, o comando não retornou nenhuma ocorrência nos serviços analisados. Isso demonstra que a criação manual de `Error` acompanhada da atribuição direta de `.status` foi removida dos componentes contemplados pela manutenção.

### Comparação estrutural

| Aspecto | ANTES | DEPOIS |
| --- | --- | --- |
| Criação dos erros controlados | Distribuída entre diferentes serviços | Centralizada em `AppError` |
| Atribuição de `status` | Realizada manualmente | Realizada pelo construtor de `AppError` |
| Estrutura comum dos erros | Repetida em diferentes pontos | Concentrada em uma abstração |
| Evolução futura da estrutura | Exige analisar diferentes implementações | Possui um ponto específico para evolução |
| Risco de inconsistências | Maior | Reduzido |

A comparação evidencia uma melhoria estrutural concreta, e não apenas uma alteração estética do código.

---

## 9. Preservação do comportamento funcional

Após a implementação, foi executada a suíte automatizada de testes:

```bash
npm test
```

Resultado:

```text
tests 9
suites 0
pass 9
fail 0
cancelled 0
skipped 0
todo 0
```

Foram executados **9 testes, todos aprovados e sem falhas**. Entre eles estava o teste específico da classe `AppError`, além dos testes já existentes relacionados a cadastro, agendamentos e validação de animais.

O resultado indica que a alteração estrutural não introduziu regressões identificáveis pela suíte automatizada existente.

---

## 10. Resultado obtido

A manutenção preventiva atingiu o objetivo proposto. A criação dos erros controlados deixou de estar distribuída entre diferentes serviços e passou a utilizar uma abstração específica, reduzindo duplicação e criando um ponto central para futuras evoluções da estrutura comum desses erros.

É importante observar que informações específicas de cada situação, como um eventual código `ANIMAL_NOT_FOUND`, ainda poderão ser fornecidas pelos pontos responsáveis por identificar aquele erro. O benefício da intervenção está na centralização da **estrutura e inicialização comuns**, evitando que cada serviço implemente individualmente essa responsabilidade.

---

## 11. Rastreabilidade no GitHub

| Artefato | Referência |
| --- | --- |
| Diagnóstico da manutenção preventiva | [`diagnostico-manutencao-preventiva.md`](./diagnostico-manutencao-preventiva.md) |
| Issue da manutenção preventiva | [Issue #31](https://github.com/llilibet/whiskerworld/issues/31) |
| Branch da intervenção | [`fix/centralizar-erros-aplicacao`](https://github.com/llilibet/whiskerworld/tree/fix/centralizar-erros-aplicacao) |
| Commit da implementação | [`c14c5d0`](https://github.com/llilibet/whiskerworld/commit/c14c5d0) |
| Pull Request | [PR #33](https://github.com/llilibet/whiskerworld/pull/33) |
| Vídeo 1 — Estado Inicial | [Acessar vídeo](./videos/video-1-antes.mp4) |
| Vídeo 2 — Estado Final | [Acessar vídeo](./videos/video-2-depois.mp4) |

---

## 12. Conclusão

A intervenção realizada caracteriza-se como **manutenção preventiva** por atuar antecipadamente sobre uma dificuldade de evolução do sistema, sem ter como objetivo corrigir uma falha funcional existente.

A criação da classe `AppError` permitiu centralizar a representação dos erros controlados e reduzir a repetição anteriormente distribuída entre diferentes serviços. Com isso, o backend ficou mais preparado para futuras alterações nessa estrutura, com menor risco de inconsistências.

As evidências obtidas após a intervenção, incluindo a eliminação do padrão anterior nos serviços analisados e a execução bem-sucedida dos testes automatizados, demonstram que a melhoria estrutural foi alcançada sem comprometer o comportamento funcional do sistema. Dessa forma, o trabalho evidencia uma melhoria concreta na manutenibilidade do Whiskerworld.
