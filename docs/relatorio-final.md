# Relatório Final — Manutenção Corretiva

## 1. Apresentação do Sistema

O **Whiskerworld** é uma aplicação web voltada ao processo de adoção de cães e gatos, criada para aproximar adotantes, ONGs e responsáveis pela administração da plataforma. O sistema permite visualizar animais disponíveis, cadastrar e autenticar usuários, favoritar pets, solicitar e agendar visitas, além de oferecer uma área administrativa para gerenciamento de animais e agendamentos.

A aplicação é composta por frontend e backend, com separação entre a interface utilizada pelos usuários, as regras de negócio e os serviços responsáveis pelo armazenamento e processamento dos dados. A estrutura das principais entidades e seus relacionamentos também é representada por meio de um diagrama de classes.

A documentação completa do sistema, incluindo descrição, arquitetura, diagrama e instruções para execução local, pode ser consultada em:

[`docs/apresentacao-sistema.md`](./apresentacao-sistema.md)

## 2. Bugs Identificados

Durante a etapa de manutenção corretiva foram identificados quatro bugs no sistema Whiskerworld, envolvendo falhas de lógica, segurança e dependência vulnerável.

Os bugs foram analisados e classificados quanto ao tipo e à severidade, e seus detalhes estão documentados no arquivo específico de identificação e classificação de bugs.

A documentação completa pode ser consultada em:

[`docs/bugs-e-classificacao.md`](./bugs-e-classificacao.md)

Os quatro bugs identificados foram posteriormente registrados como Issues no GitHub e seguiram o fluxo de triagem, correção, revisão e validação previsto na atividade. Na tabela a seguir, podemos ver o rastreamento dos bugs.

| Bug | Issue | Pull Request |
|---|---|---|
| BUG-001 | [Issue #16](https://github.com/llilibet/whiskerworld/issues/16) | [PR #20](https://github.com/llilibet/whiskerworld/pull/20) |
| BUG-002 | [Issue #17](https://github.com/llilibet/whiskerworld/issues/17) | [PR #21](https://github.com/llilibet/whiskerworld/pull/21) |
| BUG-003 | [Issue #18](https://github.com/llilibet/whiskerworld/issues/18) | [PR #22](https://github.com/llilibet/whiskerworld/pull/22) |
| BUG-004 | [Issue #28](https://github.com/llilibet/whiskerworld/issues/28) | [PR #30](https://github.com/llilibet/whiskerworld/pull/30) |
## 3. Uso do Dependabot

Como ferramenta de apoio à identificação de vulnerabilidades em dependências, foi utilizado o Dependabot do GitHub.

O Dependabot identificou um alerta relacionado ao `react-router-dom` utilizado pelo frontend do Whiskerworld. Após a análise do alerta pelo grupo, foi criada a Issue #28 para registrar o problema como uma dependência vulnerável.

A dependência foi atualizada da versão `6.26.1` para `6.30.6`, e a correção foi realizada no Pull Request #30.

A evidência do alerta e a classificação do bug devem permanecer registradas em [`docs/bugs-e-classificacao.md`](./bugs-e-classificacao.md), juntamente com o print gerado pelo Dependabot.

---

## 4. Correção e Rastreamento

Os bugs identificados foram registrados individualmente na aba Issues do GitHub. Cada Issue contém a descrição do problema, classificação, severidade, passos para reprodução, resultado obtido, resultado esperado e evidências do comportamento incorreto.

Após a triagem, cada correção foi desenvolvida em uma branch separada. Ao final da implementação foram criados Pull Requests para integração das alterações à branch `main`.

Os Pull Requests passaram por revisão de outro integrante da equipe antes do merge. Após a aprovação das alterações, os PRs foram integrados à branch principal e as Issues correspondentes foram encerradas.

---

## 5. Evidências de Validação

### 5.1 BUG-001 — Agendamentos aos domingos

Foi criado um teste automatizado para reproduzir o comportamento relacionado aos agendamentos realizados aos domingos.

**Comando utilizado:**

`npm test -- --test-name-pattern="domingo|sábado|sabado"`

**Resultado:**
- 2 testes executados;
- 2 testes aprovados;
- 0 falhas.

As evidências estão disponíveis no [Pull Request #20](https://github.com/llilibet/whiskerworld/pull/20).

### 5.2 BUG-002 — Cadastro de animal com nome inválido

Foram adicionados testes automatizados para verificar a validação do nome utilizado durante o cadastro do animal.

**Comando utilizado:**

`npm test -- --test-name-pattern="nome de animal|nome.*animal|animal.*nome"`

**Resultado:**
- 5 testes executados;
- 5 testes aprovados;
- 0 falhas.

As evidências estão registradas no [Pull Request #21](https://github.com/llilibet/whiskerworld/pull/21).

### 5.3 BUG-003 — Cadastro público de administradores

Foram adicionados testes automatizados para verificar a remoção das possibilidades de criação pública de uma conta administrativa.

**Comando utilizado:**

`npm test -- --test-name-pattern="admin|cadastro"`

**Resultado:**
- 8 testes executados;
- 8 testes aprovados;
- 0 falhas.

As evidências estão disponíveis no [Pull Request #22](https://github.com/llilibet/whiskerworld/pull/22).

### 5.4 BUG-004 — Dependência vulnerável do React Router

A correção foi validada por meio de teste automatizado.

Foi adicionado o teste:

`src/react-router-security.test.jsx`

**Comando utilizado:**

`npx vitest run src/react-router-security.test.jsx`

**Resultado:**
- 1 arquivo de teste executado;
- 1 teste executado;
- 1 teste aprovado;
- 0 falhas.

Após a atualização para `react-router-dom@6.30.6`, o teste foi executado com sucesso e confirmou que o projeto utiliza a versão definida na correção.

A evidência da execução está registrada tanto na [Issue #28](https://github.com/llilibet/whiskerworld/issues/28) quanto no [Pull Request #30](https://github.com/llilibet/whiskerworld/pull/30).

---

## 6. Revisão dos Pull Requests

As correções passaram pelo processo de revisão antes de serem integradas à branch principal.

No BUG-001, a revisão confirmou a validação implementada no backend e os testes relacionados aos agendamentos aos domingos.

No BUG-002, foram verificadas a validação do nome do animal e a cobertura dos novos testes.

No BUG-003, foram revisadas as alterações relacionadas à remoção do cadastro público administrativo e os testes destinados a evitar regressões.

No BUG-004, foram revisadas a atualização do `react-router-dom`, a criação do teste automatizado e a configuração necessária para execução dos testes com Vitest. Após a revisão, o Pull Request #30 foi aprovado e integrado à branch `main`.

---

## 7. Retrabalho

Não foi identificado, durante o processo registrado no GitHub, nenhum caso que exigisse reabertura de Issue após o merge ou uma nova correção causada por falha da solução implementada.

As alterações passaram pelo processo de revisão antes da integração e os testes de validação executados após as correções apresentaram resultados satisfatórios.

---

## 8. Considerações Finais

A atividade de manutenção corretiva realizada no Whiskerworld permitiu aplicar de forma prática as principais etapas envolvidas na identificação, documentação, triagem, correção e validação de defeitos de software.

A utilização das Issues possibilitou manter um histórico claro dos problemas identificados e de suas características, enquanto o desenvolvimento das correções em branches independentes evitou alterações diretas na versão principal do sistema. Os Pull Requests permitiram que as modificações fossem analisadas por outro integrante antes da integração.

A utilização do Dependabot complementou a inspeção manual do sistema, permitindo identificar uma vulnerabilidade relacionada a uma dependência do frontend e demonstrando a importância de acompanhar não apenas o código desenvolvido pela equipe, mas também as bibliotecas utilizadas pelo projeto.

Os testes automatizados utilizados durante as correções também contribuíram para a validação dos ajustes e para a criação de uma base de testes de regressão. Dessa forma, o processo de manutenção corretiva foi conduzido de maneira rastreável, colaborativa e verificável dentro do próprio GitHub.
