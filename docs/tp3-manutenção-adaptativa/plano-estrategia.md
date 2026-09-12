# Plano de Estratégia Adaptativa — Whiskerworld

## 1. Identificação do sistema

O **Whiskerworld** é um sistema web voltado à adoção de animais. A aplicação permite visualizar animais disponíveis, criar e autenticar contas, favoritar animais e solicitar agendamentos de visitas. Também possui funcionalidades administrativas para gerenciamento de animais e agendamentos.

**Tecnologias principais:**

* React — frontend
* Node.js + Express — backend
* Firebase — persistência e autenticação

## 2. Objetivo

O objetivo deste plano é definir as estratégias de **manutenção adaptativa** que serão aplicadas ao Whiskerworld, demonstrando a capacidade do sistema de se adaptar a mudanças externas.

Serão desenvolvidas três estratégias:

1. **Mudança de dependência de software**
2. **Mudança de regulamentação ou política**
3. **Integração com API externa**

Cada estratégia será desenvolvida separadamente, registrando o problema, a adaptação realizada e as evidências antes e depois da alteração.

## 3. Estratégia 1 — Mudança de dependência

### Problema adaptativo

O backend utiliza o **Express** para criação do servidor HTTP, definição de rotas e utilização de middlewares.

Atualmente, o projeto utiliza:

```json
"express": "^5.1.0"
```

Será realizada uma atualização controlada dessa dependência, simulando uma mudança no ambiente tecnológico utilizado pelo sistema.

A alteração poderá exigir ajustes relacionados ao servidor, rotas, middlewares ou tratamento das requisições.

### Adaptação planejada

A adaptação seguirá estas etapas:

1. Registrar a versão atual da dependência.
2. Criar uma branch específica.
3. Atualizar a versão do Express.
4. Instalar novamente as dependências.
5. Executar o backend.
6. Verificar as principais funcionalidades.
7. Identificar possíveis incompatibilidades.
8. Realizar os ajustes necessários.
9. Executar novamente a aplicação.
10. Registrar as diferenças entre antes e depois.

A adaptação deverá preservar:

* inicialização do servidor;
* funcionamento das rotas;
* utilização de middlewares;
* comunicação entre controllers e services;
* funcionamento dos endpoints existentes.

### Evidências

Serão registradas:

* versão anterior e posterior do Express;
* funcionamento antes da atualização;
* possíveis erros encontrados;
* alterações realizadas;
* funcionamento após a adaptação;
* histórico das alterações no GitHub.

## 4. Estratégia 2 — Mudança de regulamentação/política

### Problema adaptativo

O sistema será adaptado a novos requisitos relacionados à **privacidade e ao tratamento dos dados dos usuários**, utilizando a LGPD como referência para a atividade acadêmica.

Serão implementadas duas adaptações:

* exclusão de conta;
* aceite dos Termos de Uso e da Política de Privacidade.

> **Observação:** a implementação possui finalidade acadêmica e não representa uma certificação de conformidade jurídica com a LGPD.

### 4.1 Exclusão de conta

Será adicionada uma funcionalidade para que o usuário possa solicitar a exclusão de sua conta.

**Fluxo planejado:**

1. O usuário acessa sua área de conta.
2. Seleciona a opção de exclusão.
3. O sistema apresenta uma confirmação.
4. O usuário confirma a solicitação.
5. O sistema processa a exclusão.
6. Os dados relacionados são tratados conforme a implementação definida para a atividade.

A funcionalidade deverá envolver as camadas necessárias, como interface, rota, controller e service.

### 4.2 Termos de Uso e Política de Privacidade

O cadastro será adaptado para apresentar os **Termos de Uso** e a **Política de Privacidade**.

O usuário deverá manifestar explicitamente seu aceite antes da conclusão do cadastro.

Caso o aceite obrigatório não seja realizado, o sistema deverá impedir a conclusão do cadastro.

### Evidências

Serão apresentadas:

* cadastro antes da alteração;
* nova interface com os termos;
* tentativa de cadastro sem aceite;
* cadastro após o aceite;
* fluxo de exclusão da conta;
* código responsável pelas alterações.

## 5. Estratégia 3 — Integração com API externa

### Problema adaptativo

O Whiskerworld possui uma API própria utilizada pelo frontend, porém atualmente não possui uma integração externa que demonstre a adaptação do sistema a uma nova fonte de dados.

Será simulada uma necessidade de integração com uma **API pública relacionada a uma funcionalidade do sistema**.

A API deverá possuir uma utilização coerente com o contexto do Whiskerworld.

> **Possibilidade:** utilizar a **ViaCEP** para consulta de endereço a partir do CEP, caso essa integração seja adequada ao fluxo definido pelo grupo.

### Adaptação planejada

Antes da implementação, a API será testada utilizando o **Postman**.

O processo será:

1. Selecionar a API.
2. Identificar o endpoint.
3. Realizar uma requisição no Postman.
4. Analisar a resposta JSON.
5. Registrar a requisição e a resposta.
6. Implementar a integração.
7. Adaptar o código para consumir os dados externos.
8. Executar e testar a funcionalidade.
9. Comparar o comportamento antes e depois.

### Evidências

Serão apresentadas:

* requisição realizada no Postman;
* resposta JSON;
* registro ou exportação da requisição;
* código da integração;
* funcionamento da funcionalidade no sistema;
* comparação antes e depois.

## 6. Organização das branches

Cada estratégia será desenvolvida em uma branch própria:

```text
main
├── manutencao-dependencia
├── manutencao-regulamentacao
└── manutencao-api
```

As branches serão utilizadas para manter as alterações independentes e facilitar o desenvolvimento, testes e revisão.

Após a validação, as alterações poderão ser integradas à `main`.

## 7. Organização dos arquivos

A estrutura do projeto seguirá o modelo recomendado na atividade:

```text
whiskerworld/
├── manutenção-adaptativa/
│   ├── plano-estrategia.md
│   ├── evidencia1.md
│   ├── evidencia2.md
│   └── evidencia3.md
│
├── src/
│   └── código atualizado do sistema
│
└── RELATORIO.md
```

| Arquivo               | Finalidade                              |
| --------------------- | --------------------------------------- |
| `plano-estrategia.md` | Planejamento das três estratégias       |
| `evidencia1.md`       | Evidências da mudança de dependência    |
| `evidencia2.md`       | Evidências da mudança de regulamentação |
| `evidencia3.md`       | Evidências da integração com API        |
| `src/`                | Código atualizado do sistema            |
| `RELATORIO.md`        | Síntese final das adaptações            |



## 8. Síntese das estratégias

| Estratégia         | Mudança                         | Adaptação esperada                    | Evidência             |
| ------------------ | ------------------------------- | ------------------------------------- | --------------------- |
| **Dependência**    | Atualização do Express          | Corrigir possíveis incompatibilidades | Antes/depois + código |
| **Regulamentação** | Novos requisitos de privacidade | Exclusão de conta + aceite dos termos | Interface + código    |
| **API externa**    | Nova integração                 | Consumo de dados externos             | Postman + sistema     |

## 10. Resultado esperado

Ao final da atividade, o Whiskerworld deverá apresentar as três adaptações implementadas e documentadas.

As evidências e o relatório final permitirão comparar o sistema **antes e depois das alterações**, demonstrando os impactos, as adaptações realizadas e os resultados obtidos.
