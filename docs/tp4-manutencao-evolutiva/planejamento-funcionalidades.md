# Avaliação Heurística do Sistema Atual — Whiskerworld

## 1. Objetivo

Esta avaliação tem como objetivo analisar a interface atual do sistema **Whiskerworld** antes da etapa de redesign, identificando problemas de usabilidade com base nas **10 Heurísticas de Usabilidade de Nielsen**.

A análise busca registrar os pontos observados na versão atual do sistema, incluindo problemas de usabilidade, seu impacto, nível de severidade, evidências visuais e o planejamento das possíveis correções.

Os resultados desta avaliação servirão como base para a etapa posterior de redesign, permitindo relacionar as alterações realizadas às heurísticas de usabilidade correspondentes.

Esta etapa contempla a **avaliação heurística do sistema atual e o planejamento das correções identificadas**, não incluindo a implementação do redesign, novas funcionalidades ou melhorias de acessibilidade.

---

# 2. Metodologia

A avaliação foi realizada por meio da navegação e inspeção das principais telas e fluxos disponíveis na versão atual do Whiskerworld.

Foram analisadas as seguintes áreas:

* Página inicial;
* Tela de login;
* Tela de cadastro;
* Dashboard do usuário;
* Listagem de animais;
* Categorias de animais;
* Estado de lista sem resultados;
* Formulários;
* Mensagens de erro apresentadas pelo sistema.

Cada uma das 10 heurísticas de Nielsen foi analisada individualmente.

Quando um problema foi identificado, foram registrados:

* tela ou fluxo em que o problema ocorre;
* descrição do problema;
* fluxo atual;
* impacto para o usuário;
* heurística relacionada;
* nível de severidade;
* evidência visual;
* planejamento da correção.

Quando não foi identificado um problema significativo, a heurística foi registrada como **"Nenhum problema significativo identificado"**.

---

# 3. Critérios de severidade

| Severidade      | Descrição                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **1 — Baixa**   | Problema de pequena importância, com pouco impacto na utilização do sistema.                                             |
| **2 — Média**   | Problema que pode causar confusão ou dificuldade durante a utilização, mas não impede a realização da tarefa.            |
| **3 — Alta**    | Problema que pode dificultar significativamente uma tarefa importante ou levar o usuário a realizar uma ação indesejada. |
| **4 — Crítica** | Problema que impede ou compromete gravemente a utilização de uma funcionalidade essencial.                               |

---

# 4. Avaliação das 10 Heurísticas

## H1 — Visibilidade do status do sistema

> O sistema deve sempre manter o usuário informado sobre o que está acontecendo através de feedback adequado em um tempo razoável.

### Resultado

**Nenhum problema significativo identificado.**

Durante a avaliação das telas e fluxos disponíveis, não foi identificado um problema significativo relacionado à ausência de feedback ou à falta de informação sobre o estado das ações realizadas pelo usuário.

**Severidade:** Não se aplica.

**Evidência:** Não se aplica.

**Planejamento da correção:** Não se aplica. A heurística será mantida como referência durante o redesign para evitar a introdução de problemas relacionados à visibilidade do status do sistema.

---

## H2 — Correspondência entre o sistema e o mundo real

> O sistema deve falar a linguagem do usuário, com palavras, frases e conceitos familiares ao mundo real, em vez de termos orientados à máquina.

### Resultado

**Nenhum problema significativo identificado.**

Os principais termos utilizados pelo sistema, como **"Adotante"**, **"Gatos"**, **"Cães"** e **"Animais"**, apresentam relação direta com o contexto de adoção de animais.

Durante a avaliação, não foi identificado um uso significativo de termos técnicos ou orientados à máquina que dificultasse a compreensão das funcionalidades principais.

**Severidade:** Não se aplica.

**Evidência:** Não se aplica.

**Planejamento da correção:** Não se aplica. Os termos considerados compreensíveis devem ser mantidos durante o redesign.

---

# H3 — Controle e liberdade do usuário

> Os usuários frequentemente escolhem funções por engano e precisam de uma "saída de emergência" clara para deixar o estado indesejado sem precisar passar por um processo longo.

### Problema identificado

**Dificuldade para trocar o tipo de acesso durante o login.**

### Fluxo atual

Na página inicial, o usuário pode escolher entre diferentes tipos de acesso, como **"Sou Adotante"** e **"Sou Administrador"**.

Ao selecionar **"Sou Adotante"**, o usuário é direcionado para:

```text
/login?tipo=ADOTANTE
```

Na tela seguinte, o sistema apresenta **"Área do Adotante"**.

Caso o usuário perceba que escolheu o tipo de acesso incorreto ou queira acessar outra área, precisa utilizar **"Voltar ao início"** e retornar à página inicial para realizar uma nova escolha.

### Problema para o usuário

O usuário não possui uma forma direta de alterar o tipo de acesso dentro do próprio fluxo de login.

Isso cria um caminho desnecessariamente longo para uma situação simples: **trocar o perfil de acesso**.

**Heurística:** H3 — Controle e liberdade do usuário

**Severidade:** 2 — Média

**Evidência:** `evidencias/h02-login-perfil.png`

### Planejamento da correção

Durante o redesign, pretende-se:

* disponibilizar uma opção mais direta para **trocar o tipo de acesso**;
* permitir que o usuário retorne à seleção de perfil sem precisar voltar completamente para a página inicial;
* manter uma ação de retorno claramente identificada;
* preservar os dados já preenchidos no formulário quando possível, evitando retrabalho.

### Resultado esperado

O usuário deverá conseguir corrigir uma escolha de perfil de maneira mais direta, sem precisar abandonar completamente o fluxo de login.

---

# H4 — Consistência e padrões

> Os usuários não devem ter que adivinhar se diferentes palavras, situações ou ações significam a mesma coisa. Siga convenções de plataforma.

### Ponto de atenção identificado

**Diferença visual entre as opções de acesso na página inicial.**

### Fluxo atual

Na seção **"Como deseja acessar?"**, são apresentadas as opções:

* **Sou Adotante**
* **Sou Administrador**

Os dois caminhos pertencem à mesma categoria de decisão — escolha do tipo de acesso — porém utilizam estilos e cores diferentes em seus botões.

### Problema para o usuário

A diferença visual não impede o uso do sistema e **não foi considerada, isoladamente, uma falha funcional**.

Entretanto, a apresentação poderia estabelecer um padrão visual mais consistente para opções que pertencem ao mesmo grupo de escolha.

Por esse motivo, este item é tratado como **ponto de atenção para o redesign**, e não como um problema crítico.

**Heurística:** H4 — Consistência e padrões

**Severidade:** 2 — Média

**Evidência:** `evidencias/h01-home-botoes.png`

### Planejamento da correção

Durante o redesign, pretende-se:

* estabelecer um padrão visual comum para as opções de acesso;
* manter a diferenciação entre os perfis sem depender exclusivamente de cores;
* utilizar hierarquia visual consistente para títulos, textos e botões;
* garantir que ações equivalentes possuam aparência e comportamento previsíveis.

### Resultado esperado

As opções de acesso deverão continuar sendo facilmente diferenciáveis, mas apresentar uma organização visual mais consistente.

---

# H5 — Prevenção de erros

> Mais do que boas mensagens de erro, é preciso um design cuidadoso que previna a ocorrência de falhas antes mesmo que o usuário faça a ação.

## H5.1 — Exclusão da conta

### Problema identificado

**Ação de exclusão da conta apresentada junto às ações rotineiras.**

### Fluxo atual

No dashboard do usuário, a opção **"Excluir minha conta"** aparece na mesma área geral das demais funcionalidades.

### Problema para o usuário

A exclusão da conta é uma ação potencialmente destrutiva e possui consequências maiores que ações comuns de navegação ou consulta.

Sua apresentação junto às ações rotineiras pode não destacar suficientemente a diferença de impacto entre essa ação e as demais.

**Severidade:** 3 — Alta

**Evidência:** `evidencias/h04-dashboard-exclusao.png`

### Planejamento da correção

Durante o redesign, pretende-se:

* separar visualmente ações destrutivas das ações rotineiras;
* utilizar uma apresentação visual diferenciada para a exclusão;
* adicionar uma confirmação antes da exclusão definitiva;
* informar claramente as consequências da ação;
* permitir que o usuário cancele a operação antes da confirmação definitiva.

### Resultado esperado

A ação de exclusão deverá exigir uma confirmação consciente do usuário, reduzindo a possibilidade de uma exclusão não intencional.

---

## H5.2 — Identificação dos campos obrigatórios

### Problema identificado

**Ausência de indicação visual antecipada dos campos obrigatórios.**

### Fluxo atual

No formulário de cadastro, os campos são apresentados sem uma indicação visual explícita, como:

```text
Nome *
E-mail *
Senha *
```

ou:

```text
Nome (obrigatório)
```

### Problema para o usuário

O usuário pode não saber antecipadamente quais campos são obrigatórios antes de tentar enviar o formulário.

Isso pode aumentar a possibilidade de preenchimento incompleto e exigir uma nova interação para descobrir quais informações são necessárias.

**Severidade:** 2 — Média

**Evidência:** `evidencias/h07-campos-obrigatorios.png`

### Planejamento da correção

Durante o redesign, pretende-se:

* indicar visualmente os campos obrigatórios;
* utilizar um padrão consistente para essa indicação;
* manter a indicação próxima ao respectivo campo;
* complementar a indicação visual com mensagens de validação claras quando necessário.

### Resultado esperado

O usuário deverá conseguir identificar os campos obrigatórios antes de enviar o formulário, reduzindo erros de preenchimento.

---

## H5.3 — Estado de lista sem resultados

### Ponto de atenção identificado

**Filtros e elementos de navegação permanecem disponíveis quando não existem resultados.**

### Fluxo atual

Ao acessar uma categoria sem animais disponíveis, o sistema apresenta uma mensagem informando que não existem resultados.

Mesmo nesse estado, elementos relacionados à filtragem e navegação permanecem disponíveis na interface.

**Severidade:** 1 — Baixa

**Evidência:** `evidencias/h06-lista-vazia.png`

### Planejamento da correção

Durante o redesign, pretende-se avaliar o comportamento da interface quando não houver resultados e:

* apresentar uma mensagem de estado vazio mais informativa;
* explicar ao usuário que não existem animais disponíveis naquela categoria;
* avaliar quais filtros ainda são relevantes nesse estado;
* oferecer uma alternativa de navegação, como retornar à listagem ou consultar outra categoria.

### Resultado esperado

O estado sem resultados deverá orientar o usuário sobre o que aconteceu e sobre quais ações pode realizar em seguida.

---

# H6 — Reconhecimento em vez de memorização

> Minimize a carga de memória do usuário tornando objetos, ações e opções visíveis.

### Ponto de atenção identificado

**O fluxo de exploração começa pela escolha de uma espécie.**

### Fluxo atual

Ao acessar a área de animais, o usuário encontra opções relacionadas às espécies, como **"Gatos"** e **"Cães"**.

Para visualizar os animais, precisa selecionar uma dessas categorias.

### Problema para o usuário

Para quem deseja apenas **explorar os animais disponíveis**, o fluxo exige uma decisão inicial de categoria.

O problema não está na existência dos filtros ou categorias — que são úteis —, mas na ausência de uma alternativa igualmente visível para iniciar uma exploração geral.

### Heurística

**H6 — Reconhecimento em vez de memorização**

**Severidade:** 2 — Média

**Evidência:** `evidencias/h05-listagem-especies.png`

### Planejamento da correção

Durante o redesign, pretende-se avaliar a possibilidade de:

* disponibilizar uma opção **"Ver todos"**;
* apresentar os animais disponíveis diretamente na página inicial da listagem;
* manter os filtros de espécie como mecanismos de refinamento;
* permitir que o usuário reconheça e utilize os filtros sem precisar iniciar obrigatoriamente por eles.

### Resultado esperado

O usuário poderá começar a explorar os animais sem precisar decidir previamente uma categoria, utilizando os filtros apenas quando desejar refinar a busca.

---

# H7 — Flexibilidade e eficiência de uso

> Aceleradores — ocultos para o usuário novato — podem agilizar a interação para o usuário experiente.

### Ponto de atenção identificado

A área de animais apresenta um fluxo baseado na seleção de categorias, sem uma alternativa adicional para uma exploração mais rápida do catálogo.

Esse ponto está relacionado ao mesmo fluxo observado na H6, mas é analisado aqui sob a perspectiva da **eficiência e flexibilidade de uso**.

**Severidade:** 1 — Baixa

**Evidência:** `evidencias/h05-listagem-especies.png`

### Planejamento da correção

Durante o redesign, pretende-se avaliar a disponibilização de:

* acesso direto à listagem geral;
* filtros para refinamento;
* mecanismos de busca ou ordenação, caso sejam adequados ao escopo do sistema.

### Resultado esperado

O usuário poderá escolher entre uma exploração simples ou um caminho mais rápido para encontrar animais específicos.

---

# H8 — Estética e design minimalista

> Os diálogos não devem conter informações que são irrelevantes ou pouco usadas.

### Problema identificado

**Diferença visual entre campos preenchidos e não preenchidos no cadastro.**

### Fluxo atual

Na tela de cadastro, os campos **"Nome"** e **"E-mail"**, quando preenchidos, apresentam uma aparência de fundo diferente do campo **"Senha"**.

### Problema para o usuário

A diferença visual pode fazer com que os campos preenchidos sejam interpretados como desabilitados ou somente leitura, mesmo quando continuam fazendo parte do formulário.

### Heurística

**H8 — Estética e design minimalista**

**Severidade:** 2 — Média

**Evidência:** `evidencias/h03-cadastro-inputs.png`

### Planejamento da correção

Durante o redesign, pretende-se:

* padronizar a aparência dos campos do formulário;
* diferenciar visualmente estados como preenchido, focado, desabilitado e somente leitura;
* manter contraste suficiente entre texto, fundo e bordas;
* utilizar o mesmo padrão visual para campos com estados equivalentes.

### Resultado esperado

O usuário deverá compreender visualmente quais campos estão ativos, preenchidos ou desabilitados, sem depender de tentativa e erro.

---

# H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar-se de erros

> As mensagens de erro devem ser expressas em linguagem simples, indicar precisamente o problema e sugerir uma solução construtiva.

### Problema identificado

**Mensagem de erro "Token inválido ou expirado."**

### Fluxo atual

Durante uma tentativa de cadastro, o sistema apresentou a mensagem:

> **"Token inválido ou expirado."**

### Problema para o usuário

A mensagem utiliza o termo técnico **"token"** sem explicar o que aconteceu em uma linguagem adequada ao usuário final.

Além disso, não apresenta uma orientação clara sobre como recuperar-se do erro.

### Heurística

**H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar-se de erros**

**Severidade:** 2 — Média

**Evidência:** `evidencias/h08-erro-token.png`

### Planejamento da correção

Durante o redesign, pretende-se:

* substituir termos técnicos por mensagens compreensíveis;
* explicar de forma objetiva o que ocorreu;
* indicar uma ação que o usuário possa realizar para tentar solucionar o problema;
* manter as mensagens de erro próximas ao contexto em que o problema ocorreu;
* evitar expor detalhes técnicos internos desnecessários ao usuário.

### Exemplo de direção para a correção

Em vez de apresentar apenas:

> "Token inválido ou expirado."

A interface poderá apresentar uma mensagem em linguagem orientada ao usuário, acompanhada de uma ação de recuperação adequada ao fluxo.

### Resultado esperado

O usuário deverá compreender o problema e saber qual ação realizar para tentar continuar o processo.

### Observação

A avaliação registra o **comportamento observado na interface**. A causa técnica responsável pela mensagem não é determinada nesta avaliação heurística.

---

# H10 — Ajuda e documentação

> É melhor que o sistema não precise de explicação adicional, mas pode ser necessário fornecer ajuda e documentação fáceis de buscar.

### Resultado

**Nenhum problema significativo identificado durante a avaliação.**

Nas telas analisadas, não foi identificado um problema específico relacionado à ausência de orientação que impedisse a compreensão das funcionalidades avaliadas.

**Severidade:** Não se aplica.

**Evidência:** Não se aplica.

**Planejamento da correção:** Não se aplica. Durante o redesign, a equipe deverá manter textos e orientações suficientemente claros para que o usuário consiga utilizar as funcionalidades sem depender de documentação externa.

---

# 5. Resumo dos problemas e planejamento das correções

| ID  | Heurística | Problema observado                                        | Severidade | Planejamento da correção                                      | Evidência                     |
| --- | ---------- | --------------------------------------------------------- | ---------: | ------------------------------------------------------------- | ----------------------------- |
| P01 | H3         | Dificuldade para trocar o tipo de acesso durante o login  |          2 | Permitir troca direta de perfil e retorno ao fluxo de seleção | `h02-login-perfil.png`        |
| P02 | H4         | Apresentação visual pouco uniforme entre opções de acesso |          2 | Padronizar componentes e hierarquia visual                    | `h01-home-botoes.png`         |
| P03 | H5         | Exclusão da conta junto às ações rotineiras               |          3 | Destacar ação destrutiva e exigir confirmação                 | `h04-dashboard-exclusao.png`  |
| P04 | H5         | Campos obrigatórios sem indicação visual antecipada       |          2 | Indicar campos obrigatórios e melhorar validação              | `h07-campos-obrigatorios.png` |
| P05 | H5         | Filtros permanecem disponíveis em estado sem resultados   |          1 | Melhorar estado vazio e orientar próxima ação                 | `h06-lista-vazia.png`         |
| P06 | H6         | Exploração inicia pela escolha de uma espécie             |          2 | Disponibilizar opção de visualizar todos os animais           | `h05-listagem-especies.png`   |
| P07 | H7         | Ausência de alternativa mais direta para exploração       |          1 | Avaliar listagem geral, busca e filtros                       | `h05-listagem-especies.png`   |
| P08 | H8         | Campos preenchidos possuem aparência visual diferente     |          2 | Padronizar estados visuais dos campos                         | `h03-cadastro-inputs.png`     |
| P09 | H9         | Mensagem técnica sem orientação de recuperação            |          2 | Utilizar linguagem simples e orientar recuperação             | `h08-erro-token.png`          |

---

# 6. Síntese por heurística

| Heurística                                                  | Resultado                                  |
| ----------------------------------------------------------- | ------------------------------------------ |
| **H1 — Visibilidade do status do sistema**                  | Nenhum problema significativo identificado |
| **H2 — Correspondência entre sistema e mundo real**         | Nenhum problema significativo identificado |
| **H3 — Controle e liberdade do usuário**                    | Problema identificado                      |
| **H4 — Consistência e padrões**                             | Ponto de atenção identificado              |
| **H5 — Prevenção de erros**                                 | Problemas identificados                    |
| **H6 — Reconhecimento em vez de memorização**               | Ponto de atenção identificado              |
| **H7 — Flexibilidade e eficiência de uso**                  | Ponto de atenção identificado              |
| **H8 — Estética e design minimalista**                      | Problema identificado                      |
| **H9 — Reconhecimento, diagnóstico e recuperação de erros** | Problema identificado                      |
| **H10 — Ajuda e documentação**                              | Nenhum problema significativo identificado |

---

# 7. Evidências

As capturas de tela utilizadas como evidências estão armazenadas em:

```text
docs/tp4-manutenção-evolutiva/redesign/evidencias/
```

Arquivos:

```text
h01-home-botoes.png
h02-login-perfil.png
h03-cadastro-inputs.png
h04-dashboard-exclusao.png
h05-listagem-especies.png
h06-lista-vazia.png
h07-campos-obrigatorios.png
h08-erro-token.png
```

As imagens correspondem às situações observadas durante a avaliação e documentam visualmente os pontos identificados.

---

# 8. Limitações da avaliação

A avaliação foi realizada sobre as funcionalidades que estavam disponíveis e acessíveis durante o período de análise.

Algumas funcionalidades não puderam ser avaliadas integralmente devido às condições do ambiente de execução e à disponibilidade de dados.

Entre as limitações observadas estão:

* ausência de animais disponíveis em determinadas categorias;
* impossibilidade de avaliar integralmente o fluxo de agendamento quando não havia animais ou horários disponíveis;
* acesso limitado às funcionalidades administrativas;
* impossibilidade de avaliar integralmente operações de cadastro, edição e exclusão de animais na área administrativa;
* fluxo de autenticação com Google não avaliado integralmente;
* funcionalidades relacionadas a favoritos não avaliadas quando dependiam da existência de animais disponíveis;
* não foram provocados deliberadamente erros de servidor ou falhas técnicas que não ocorressem durante o uso normal.

Dessa forma, os resultados representam as condições observadas durante a avaliação e não devem ser interpretados como uma análise exaustiva de todas as funcionalidades internas do sistema.

---

# 9. Considerações finais

A avaliação heurística permitiu identificar pontos da interface atual do Whiskerworld que podem ser considerados na etapa posterior de redesign.

Os principais pontos observados estão relacionados a:

* controle do fluxo de acesso;
* consistência visual;
* prevenção de ações potencialmente destrutivas;
* indicação de campos obrigatórios;
* tratamento de estados sem resultados;
* exploração e navegação pelos animais;
* apresentação visual dos campos de formulário;
* clareza das mensagens de erro.

Para cada problema ou ponto de atenção identificado, foi registrado um **planejamento inicial de correção**, indicando a direção que poderá ser adotada durante o redesign.

Essas propostas não representam ainda a implementação definitiva. Elas servem como referência para orientar as decisões da equipe na próxima etapa do trabalho.

As alterações realizadas posteriormente deverão ser comparadas com o estado atual documentado nesta avaliação, permitindo demonstrar quais problemas foram tratados e como as mudanças se relacionam às heurísticas de Nielsen.

A avaliação representa o estado observado do sistema antes das modificações de redesign.
