# Relatório Final — Manutenção Adaptativa

## 1. Identificação da intervenção

Este relatório apresenta as intervenções de manutenção adaptativa realizadas no sistema **Whiskerworld**, como parte da disciplina de Manutenção e Integração de Software.

O objetivo da atividade foi adaptar o sistema diante de mudanças externas que poderiam afetar seu funcionamento, sua utilização ou sua integração com outros componentes e serviços.

Foram realizadas três estratégias de manutenção adaptativa:

- mudança de dependência de software;
- mudança de regulamentação/política;
- migração de API externa.

As intervenções foram acompanhadas de evidências do estado anterior e posterior, testes e outras formas de validação, permitindo verificar o comportamento do sistema após as adaptações.

---

## 2. Apresentação do sistema e contexto da manutenção adaptativa

O **Whiskerworld** é uma aplicação web voltada ao processo de adoção de animais. O sistema permite visualizar animais disponíveis, cadastrar e autenticar usuários, favoritar animais e solicitar agendamentos de visitas.

A aplicação também possui funcionalidades administrativas relacionadas ao gerenciamento de animais e agendamentos.

O sistema é composto por frontend e backend, utilizando **React** no frontend, **Node.js e Express** no backend, **Firebase** para persistência e autenticação e **Vite** como ferramenta de desenvolvimento e compilação do frontend.

A manutenção adaptativa foi aplicada considerando diferentes mudanças externas ao código principal da aplicação. Dessa forma, foram utilizados três cenários distintos para demonstrar como o sistema pode ser ajustado quando seu ambiente tecnológico, seus requisitos relacionados a políticas ou seus serviços externos são modificados.

As estratégias realizadas foram:

| Estratégia | Tipo de mudança | Adaptação realizada |
|---|---|---|
| Estratégia 1 | Mudança de dependência | Atualização do Vite e adaptação do plugin React |
| Estratégia 2 | Mudança de regulamentação/política | Exclusão de conta e aceite dos Termos de Uso e Política de Privacidade |
| Estratégia 3 | Migração de API externa | Substituição da Cat Facts API pela MeowFacts API |

---

# 3. Estratégia 1 — Mudança de Dependência

## 3.1 Situação encontrada

O frontend do Whiskerworld utilizava o **Vite** como ferramenta de desenvolvimento e compilação da aplicação React.

Antes da intervenção, as dependências relacionadas ao Vite estavam nas seguintes versões:

| Dependência | Versão anterior |
|---|---:|
| `vite` | `5.4.21` |
| `@vitejs/plugin-react` | `4.7.0` |

Como cenário de mudança, o Vite foi atualizado para a versão `8.3.0`.

Após essa atualização, foi identificada uma incompatibilidade entre o Vite e a versão utilizada do `@vitejs/plugin-react`.

A versão `4.7.0` do plugin declarava suporte às versões 4, 5, 6 e 7 do Vite, não contemplando a versão `8.3.0`.

A incompatibilidade foi verificada utilizando o comando:

```bash
npm ls vite @vitejs/plugin-react
```
O resultado apresentou a versão do Vite como inválida e o npm retornou ELSPROBLEMS, indicando que a árvore de dependências estava inconsistente.

## 3.2 Adaptação realizada

Para solucionar a incompatibilidade causada pela atualização do Vite, o `@vitejs/plugin-react` foi atualizado da versão `4.7.0` para a versão `6.1.1`.

O comando utilizado foi:

```bash
npm install @vitejs/plugin-react@6.1.1 --save-dev
```

Após a adaptação, as dependências passaram a utilizar:

* `vite@8.3.0`
* `@vitejs/plugin-react@6.1.1`

A alteração foi realizada nos arquivos:

* `client/package.json`
* `client/package-lock.json`

Com a atualização do plugin, a incompatibilidade entre as dependências foi solucionada.

## 3.3 Evidência do estado inicial — ANTES

Antes da adaptação, foi registrado o funcionamento do sistema utilizando as versões originais das dependências.

Nesse estado, o frontend utilizava:

* Vite `5.4.21`
* `@vitejs/plugin-react` `4.7.0`

O sistema funcionava normalmente antes da atualização.

A evidência em vídeo demonstra o funcionamento da aplicação antes da alteração da dependência.

**Vídeo:**

`01-funcionamento-antes-atualizacao.mp4`

## 3.4 Evidência da incompatibilidade

Após a atualização do Vite para a versão `8.3.0`, foi executado:

```bash
npm ls vite @vitejs/plugin-react
```

Nesse momento, a árvore de dependências apresentou a incompatibilidade entre o Vite e o `@vitejs/plugin-react@4.7.0`.

O npm identificou o Vite como uma dependência inválida e apresentou o erro `ELSPROBLEMS`.

Essa situação foi registrada na evidência:

`02-incompatibilidade-apos-atualizacao-vite.mp4`

A evidência demonstra o impacto causado pela mudança da dependência e justifica a necessidade da adaptação realizada posteriormente.

## 3.5 Evidência do estado final — DEPOIS

Para corrigir a incompatibilidade, o `@vitejs/plugin-react` foi atualizado para a versão `6.1.1`.

Após a alteração, a árvore de dependências passou a apresentar:

```text
@vitejs/plugin-react@6.1.1
└── vite@8.3.0 deduped

vite@8.3.0
```

A verificação não apresentou mais as mensagens de dependência inválida ou `ELSPROBLEMS`.

A adaptação foi registrada na evidência:

`03-adaptacao-plugin-react.mp4`

Também foi registrado o funcionamento do sistema após a correção:

`04-funcionamento-depois-adaptacao.mp4`

## 3.6 Validação da adaptação

Após a atualização das dependências, foram realizadas diferentes validações.

Primeiramente, a árvore de dependências foi verificada novamente:

```bash
npm ls vite @vitejs/plugin-react
```

Em seguida, foi realizada a compilação do frontend:

```bash
npm run build
```

O processo de compilação foi concluído com sucesso utilizando o Vite `8.3.0`.

Também foi executado:

```bash
npm run dev
```

para verificar o funcionamento da aplicação em ambiente de desenvolvimento.

O frontend e o backend foram executados e as páginas do Whiskerworld puderam ser acessadas normalmente.

## 3.7 Resultado obtido

A primeira estratégia demonstrou a adaptação do Whiskerworld a uma mudança em uma dependência utilizada pelo projeto.

A atualização do Vite provocou uma incompatibilidade com a versão anterior do `@vitejs/plugin-react`. A atualização do plugin para a versão `6.1.1` permitiu restabelecer a compatibilidade.

Após a intervenção, a árvore de dependências foi validada, o frontend foi compilado com sucesso e o sistema continuou funcionando normalmente.

Dessa forma, a aplicação foi adaptada à nova versão da ferramenta sem comprometer as funcionalidades existentes do frontend.

# 4. Estratégia 2 — Mudança de Regulamentação/Política

## 4.1 Contexto

A segunda estratégia teve como objetivo adaptar o Whiskerworld a novos requisitos relacionados à privacidade e ao tratamento dos dados dos usuários.

Para a atividade acadêmica, a Lei Geral de Proteção de Dados (LGPD) foi utilizada como referência para a criação de funcionalidades relacionadas à exclusão de conta e ao aceite dos Termos de Uso e da Política de Privacidade.

Foram realizadas duas adaptações principais:

* implementação da exclusão da própria conta pelo usuário;
* inclusão do aceite dos Termos de Uso e da Política de Privacidade no cadastro.

> **Observação:** A implementação possui finalidade acadêmica e não representa uma certificação de conformidade jurídica do Whiskerworld com a LGPD.

## 4.2 Exclusão de conta

### 4.2.1 Situação encontrada

Antes da adaptação, o sistema não possuía uma funcionalidade para que um usuário autenticado pudesse solicitar diretamente pela plataforma a exclusão da própria conta.

Foi então implementado um fluxo específico para permitir que o usuário solicite a exclusão de sua conta e dos dados diretamente relacionados à utilização da plataforma.

### 4.2.2 Adaptação realizada

Foi adicionada à área do usuário a opção:

> **"Excluir minha conta"**

Ao selecionar essa opção, o sistema apresenta uma confirmação antes de executar a operação.

O fluxo implementado é:

1. O usuário acessa a dashboard do adotante;
2. seleciona **Excluir minha conta**;
3. o sistema apresenta um modal de confirmação;
4. o usuário pode cancelar ou confirmar a operação;
5. o backend remove os favoritos relacionados ao usuário;
6. os agendamentos relacionados ao usuário são removidos;
7. o documento do usuário é removido;
8. a conta correspondente é removida do Firebase Authentication;
9. a sessão local é encerrada;
10. o usuário retorna à página inicial.

A exclusão dos dados relacionados utiliza o UID do usuário autenticado.

Os animais cadastrados por administradores não são removidos durante a exclusão da conta do usuário.

### 4.2.3 Alterações realizadas

A implementação envolveu diferentes camadas da aplicação.

**No frontend foram alterados:**

* `client/src/pages/AdotanteDashboardPage.jsx`
* `client/src/services/usuariosService.js`
* `client/src/styles/global.css`

**No backend foram envolvidos:**

* `backend/src/routes/usuarios.js`
* `backend/src/controllers/usuariosController.js`
* `backend/src/services/usuariosService.js`
* `backend/src/repositories/usuariosRepository.js`
* `backend/src/repositories/favoritosRepository.js`
* `backend/src/repositories/agendamentosRepository.js`

Foi implementada uma rota autenticada para a exclusão:

```http
DELETE /usuarios/me
```

O controller encaminha a solicitação para o serviço responsável pela exclusão dos dados relacionados ao usuário.

### 4.2.4 Resultado

Após a adaptação, o usuário autenticado passou a possuir uma opção na própria plataforma para solicitar a exclusão da conta.

A operação apresenta confirmação antes da execução e remove os dados diretamente relacionados à utilização da plataforma, além da conta correspondente no Firebase Authentication.

## 4.3 Termos de Uso e Política de Privacidade

### 4.3.1 Situação encontrada

O cadastro original não apresentava os Termos de Uso e a Política de Privacidade como documentos que deveriam ser consultados e aceitos pelo usuário antes da criação da conta.

Também não existia uma validação específica para impedir o cadastro quando esses aceites não fossem realizados.

### 4.3.2 Adaptação realizada

O formulário de cadastro foi adaptado para apresentar:

* Termos de Uso;
* Política de Privacidade;
* checkbox obrigatório para aceite dos Termos de Uso;
* checkbox obrigatório para aceite da Política de Privacidade.

Os documentos podem ser visualizados pelo usuário antes da confirmação do cadastro.

O cadastro somente pode ser concluído quando os dois aceites obrigatórios forem realizados.

Além da validação realizada no frontend, o backend também verifica se os dois valores foram enviados como verdadeiros.

A validação considera:

```javascript
aceitouTermos === true
aceitouPrivacidade === true
```

Caso algum dos aceites não seja realizado, o cadastro é bloqueado.

### 4.3.3 Registro dos aceites

O sistema também passou a registrar informações relacionadas ao aceite dos documentos.

São registrados:

* aceite dos Termos de Uso;
* data e horário do aceite dos Termos;
* versão dos Termos de Uso;
* aceite da Política de Privacidade;
* data e horário do aceite da Política de Privacidade;
* versão da Política de Privacidade.

As versões utilizadas na implementação acadêmica são:

```javascript
versaoTermos: '1.0'
versaoPrivacidade: '1.0'
```

### 4.3.4 Resultado

Após a adaptação, o cadastro passou a exigir uma manifestação explícita do usuário em relação aos Termos de Uso e à Política de Privacidade.

A validação foi implementada tanto no frontend quanto no backend, impedindo a conclusão do cadastro quando algum dos aceites obrigatórios não estiver presente.

## 4.4 Evidências da adaptação

Foram produzidas evidências visuais do estado anterior e posterior das funcionalidades.

Na estratégia de exclusão de conta, foram registrados:

* cadastro antes das alterações;
* perfil antes da existência da opção de exclusão;
* resultado da exclusão da conta.

Na estratégia relacionada aos Termos de Uso e à Política de Privacidade, foi registrada a nova tela de cadastro com os documentos e os campos de aceite.

As evidências estão organizadas em:

`Evidencias/estrategia-2/`

**Os arquivos principais são:**

* `evidencia2.md`
* `01-cadastro-antes.mp4`
* `02-cadastro-com-termos.mp4`
* `03-perfil-sem-exclusao-de-conta.mp4`
* `04-resultado-exclusao-de-conta.mp4`

## 4.5 Validação da adaptação

Foram realizadas diferentes formas de validação após a implementação.

Foram executadas verificações de sintaxe nos arquivos do backend utilizando `node --check`.

Também foram executados os testes automatizados do backend.

**Resultado do backend:**

* 9 testes aprovados;
* 0 falhas.

No frontend também foi executada a suíte de testes.

**Resultado do frontend:**

* 1 arquivo de teste executado;
* 1 teste aprovado;
* 0 falhas.

Também foi realizada a compilação do frontend:

```bash
npm run build
```

O processo foi concluído com sucesso.

Além disso, foi executado:

```bash
git diff --check
```

sem identificação de erros de whitespace.

## 4.6 Resultado obtido

A segunda estratégia adaptou o sistema a novos requisitos relacionados ao tratamento dos dados dos usuários e à manifestação de aceite durante o cadastro.

A implementação adicionou mecanismos para exclusão da conta e dos dados diretamente relacionados ao usuário, além de exigir o aceite dos Termos de Uso e da Política de Privacidade.

As alterações foram realizadas tanto no frontend quanto no backend e foram acompanhadas por testes automatizados e evidências visuais.

# 5. Estratégia 3 — Migração de API Externa

## 5.1 Situação encontrada

O Whiskerworld não possuía uma integração pública adequada que permitisse realizar uma migração de API externa diretamente a partir de uma integração existente.

Para atender ao cenário previsto na atividade, foi utilizado um cenário simulado de migração de API externa, substituindo o serviço utilizado para obter curiosidades sobre gatos.

A API utilizada no cenário anterior foi a Cat Facts API:

```http
GET https://catfact.ninja/fact
```

A resposta desse serviço utilizava o campo:

```text
fact
```

A mudança para um novo serviço exigiu adaptação porque a estrutura da resposta da nova API era diferente.

## 5.2 API anterior

A API anterior utilizada no cenário de migração era acessada por meio do endpoint:

```http
GET https://catfact.ninja/fact
```

O conteúdo da curiosidade era disponibilizado no campo:

```text
fact
```

Esse formato foi utilizado como referência para o estado anterior da integração.

A requisição ao endpoint antigo foi realizada no Postman e apresentou resposta HTTP `200 OK`.

A evidência correspondente está registrada em:

`01-endpoint-antigo-cat-facts.png`

## 5.3 Nova API

A nova API utilizada no cenário foi a MeowFacts API.

O novo endpoint utilizado foi:

```http
GET https://meowfacts.herokuapp.com/?lang=por-br
```

Diferentemente da API anterior, a nova resposta possui uma propriedade `data` contendo um vetor com as curiosidades.

Exemplo da estrutura utilizada:

```json
{
  "data": [
    "Exemplo de curiosidade sobre gatos"
  ]
}
```

A requisição ao novo endpoint também foi realizada no Postman e apresentou resposta HTTP `200 OK`.

A evidência correspondente está registrada em:

`02-endpoint-novo-meowfacts.png`

## 5.4 Adaptação realizada

A principal adaptação necessária foi a alteração da forma de acesso ao conteúdo retornado pela API.

Na estrutura anterior, o conteúdo era obtido por:

```javascript
data.fact
```

Na nova estrutura, passou a ser obtido por:

```javascript
data.data[0]
```

Para centralizar a comunicação com a API externa, foi criado o arquivo:

`client/src/services/catFactsService.js`

O serviço é responsável por:

* realizar a requisição para a API;
* verificar o status da resposta;
* interpretar o JSON retornado;
* acessar a nova estrutura `data[0]`;
* detectar respostas inesperadas;
* retornar a curiosidade para a aplicação.

Dessa forma, a comunicação com o serviço externo fica concentrada em um ponto específico do frontend.

## 5.5 Adaptação da interface

A página inicial do Whiskerworld também foi adaptada para utilizar a nova API.

A interface passou a:

* carregar uma curiosidade automaticamente;
* apresentar um estado de carregamento;
* exibir a curiosidade recebida;
* apresentar uma mensagem quando ocorre uma falha;
* permitir solicitar outra curiosidade;
* atualizar o conteúdo sem recarregar a página inteira;
* utilizar `aria-live` para informar atualizações do conteúdo.

Também foi adicionada uma opção para buscar outra curiosidade por meio do botão:

> **"Ver outra curiosidade"**

A nova integração apresenta as curiosidades em português brasileiro.

## 5.6 Validação com Postman

O Postman foi utilizado para validar os endpoints envolvidos na migração.

Foram realizadas requisições para:

**Cat Facts API**

```http
GET https://catfact.ninja/fact
```

e:

**MeowFacts API**

```http
GET https://meowfacts.herokuapp.com/?lang=por-br
```

As respostas foram comparadas para identificar a diferença entre as estruturas retornadas pelos dois serviços.

A coleção utilizada durante os testes foi exportada como:

`colecao-postman-migracao-api.json`

Essa coleção faz parte das evidências da estratégia de migração.

## 5.7 Comparação ANTES e DEPOIS

| Aspecto              | ANTES            | DEPOIS                                 |
| -------------------- | ---------------- | -------------------------------------- |
| Serviço externo      | Cat Facts API    | MeowFacts API                          |
| Endpoint             | `/fact`          | `/?lang=por-br`                        |
| Campo utilizado      | `fact`           | `data[0]`                              |
| Idioma               | Inglês           | Português brasileiro                   |
| Integração visual    | Não implementada | Seção de curiosidade na página inicial |
| Nova consulta        | Não disponível   | Botão para solicitar outra curiosidade |
| Tratamento de falhas | Não aplicável    | Mensagem de erro na interface          |

## 5.8 Evidência do estado final — DEPOIS

Após a migração, a nova API foi integrada ao frontend por meio do serviço:

`client/src/services/catFactsService.js`

A página inicial passou a apresentar as curiosidades obtidas da MeowFacts API.

Também foi implementado o botão para realizar uma nova consulta, permitindo atualizar a curiosidade sem recarregar a página.

A evidência visual da integração está registrada em:

`03-api-integrada-whiskerworld.png`

## 5.9 Validação da adaptação

A adaptação foi validada por diferentes meios.

Primeiramente, os endpoints antigo e novo foram testados no Postman.

Também foi realizada a comparação das estruturas JSON retornadas pelas APIs.

A coleção de requisições utilizada durante a validação foi exportada para documentação.

Além disso, foram realizados testes automatizados e a compilação do frontend.

Por fim, a aplicação foi executada no navegador para verificar o comportamento da nova integração, incluindo a exibição das curiosidades e a solicitação de diferentes conteúdos.

## 5.10 Resultado obtido

A terceira estratégia demonstrou a adaptação do Whiskerworld diante da substituição de um serviço externo por outro que apresenta uma estrutura de resposta diferente.

A integração foi adaptada para utilizar a MeowFacts API e interpretar corretamente seu novo formato de dados.

A comunicação externa foi centralizada em um serviço específico, enquanto a interface foi adaptada para apresentar as informações recebidas e permitir novas consultas.

Dessa forma, o sistema passou a utilizar a nova API sem depender da estrutura de resposta do serviço anterior.

# 6. Comparação geral das adaptações

As três estratégias realizadas apresentaram diferentes situações de mudança externa e exigiram adaptações específicas no Whiskerworld.

| Estratégia              | Situação de mudança                                                         | Adaptação realizada                                             | Principais validações                                 |
| ----------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| Mudança de dependência  | Atualização do Vite causou incompatibilidade com o plugin React             | Atualização do `@vitejs/plugin-react`                           | `npm ls`, `npm run build` e execução do sistema       |
| Regulamentação/política | Necessidade de adaptação relacionada à privacidade e aos dados dos usuários | Exclusão de conta e aceite dos Termos e Política de Privacidade | Testes automatizados, build e evidências da interface |
| Migração de API         | Substituição de serviço externo com estrutura de resposta diferente         | Migração para MeowFacts API                                     | Postman, comparação JSON, testes, build e execução    |

As três intervenções demonstram situações diferentes de manutenção adaptativa: uma relacionada às dependências do projeto, outra aos requisitos externos relacionados à política de tratamento de dados e a terceira à integração com um serviço externo.

# 7. Impactos das adaptações

As intervenções realizadas afetaram diferentes partes da aplicação.

A mudança de dependência modificou a configuração do frontend e as dependências relacionadas ao Vite, sendo necessário atualizar o plugin React para manter a compatibilidade.

A mudança de regulamentação/política envolveu diferentes camadas do sistema, incluindo páginas do frontend, serviços, rotas, controllers e repositórios do backend.

A migração da API externa introduziu um serviço específico para centralizar a comunicação com o novo provedor e também modificou a página inicial para apresentar as informações obtidas.

Apesar de envolverem componentes diferentes, as três adaptações tiveram o objetivo de manter o funcionamento do sistema diante de mudanças externas.

# 8. Evidências

As evidências das estratégias de manutenção adaptativa estão organizadas no diretório:

`docs/tp3-manutenção-adaptativa/Evidencias/`

## 8.1 Estratégia 1 — Mudança de Dependência

**Documentação:**

`Evidencias/estrategia-1/README.md`

**Principais evidências:**

* funcionamento antes da atualização;
* incompatibilidade após a atualização do Vite;
* adaptação do `@vitejs/plugin-react`;
* funcionamento após a adaptação;
* validação da árvore de dependências;
* compilação do frontend.

## 8.2 Estratégia 2 — Mudança de Regulamentação/Política

**Documentação:**

`Evidencias/estrategia-2/evidencia2.md`

**Principais evidências:**

* cadastro antes da adaptação;
* cadastro com Termos de Uso e Política de Privacidade;
* perfil antes da exclusão da conta;
* resultado da exclusão da conta;
* alterações no código;
* testes automatizados;
* compilação do frontend.

## 8.3 Estratégia 3 — Migração de API Externa

**Documentação:**

`Evidencias/estrategia-3/evidencia3.md`

**Principais evidências:**

* requisição à API antiga no Postman;
* requisição à nova API no Postman;
* comparação das respostas;
* coleção exportada do Postman;
* integração da nova API ao Whiskerworld;
* funcionamento da nova curiosidade na página inicial.

# 9. Rastreabilidade no GitHub

As intervenções e suas evidências estão organizadas no diretório de documentação da manutenção adaptativa:

`docs/tp3-manutenção-adaptativa/`

A documentação principal das estratégias está organizada da seguinte forma:

| Artefato                  | Localização                                                 |
| ------------------------- | ----------------------------------------------------------- |
| Plano das estratégias     | `plano-estrategia.md`                                       |
| Evidências — Estratégia 1 | `Evidencias/estrategia-1/README.md`                         |
| Evidências — Estratégia 2 | `Evidencias/estrategia-2/evidencia2.md`                     |
| Evidências — Estratégia 3 | `Evidencias/estrategia-3/evidencia3.md`                     |
| Coleção Postman           | `Evidencias/estrategia-3/colecao-postman-migracao-api.json` |
| Relatório final           | `RELATORIO.md`                                              |

As evidências individuais contêm os registros necessários para acompanhar as alterações realizadas em cada estratégia.

# 10. Considerações finais

A realização do TP3 permitiu aplicar o conceito de manutenção adaptativa em diferentes situações dentro do Whiskerworld.

A primeira estratégia demonstrou a necessidade de adaptar dependências quando uma atualização tecnológica provocou uma incompatibilidade entre o Vite e o plugin utilizado pelo frontend. A atualização do `@vitejs/plugin-react` permitiu restabelecer a compatibilidade e manter o funcionamento da aplicação.

A segunda estratégia demonstrou a adaptação do sistema a novos requisitos relacionados à privacidade e ao tratamento dos dados dos usuários. Foram implementados mecanismos para exclusão da conta e dos dados diretamente relacionados ao usuário, além da exigência de aceite dos Termos de Uso e da Política de Privacidade.

A terceira estratégia demonstrou a adaptação necessária quando ocorre a substituição de um serviço externo por outro com uma estrutura de resposta diferente. A integração foi migrada da Cat Facts API para a MeowFacts API, sendo necessário adaptar o tratamento dos dados recebidos e a interface da aplicação.

As três estratégias foram acompanhadas de evidências e validações, incluindo testes automatizados, compilação, execução do sistema, comparação dos estados anterior e posterior e testes de integração por meio do Postman.

Dessa forma, o trabalho demonstrou, de forma prática, que a manutenção adaptativa não se limita à alteração do código, mas envolve a identificação da mudança externa, análise de seu impacto, adaptação dos componentes afetados e validação do sistema após a intervenção.



