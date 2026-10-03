# Avaliação Heurística do Sistema Atual — Whiskerworld

## 1. Objetivo

Esta avaliação tem como objetivo analisar a interface atual do sistema **Whiskerworld** antes da etapa de redesign, identificando problemas de usabilidade com base nas **10 Heurísticas de Usabilidade de Nielsen**.

A análise busca registrar os pontos observados na versão atual do sistema, incluindo problemas de usabilidade, seu impacto, nível de severidade e respectivas evidências visuais.

Os resultados desta avaliação servirão como base para a etapa posterior de redesign, permitindo relacionar as alterações realizadas às heurísticas de usabilidade correspondentes.

Esta etapa contempla **somente a avaliação heurística do sistema atual**, não incluindo a implementação do redesign, novas funcionalidades ou melhorias de acessibilidade.

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
* heurística relacionada;
* impacto para o usuário;
* nível de severidade;
* evidência visual.

Quando não foi identificado um problema significativo, a heurística foi registrada como **"Nenhum problema significativo identificado"**.

---

# 3. Critérios de severidade

Para classificar os problemas encontrados, foi utilizada a seguinte escala:

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

As situações observadas não apresentaram uma falha de visibilidade do status do sistema que justificasse o registro de um problema específico.

**Severidade:** Não se aplica.

**Evidência:** Não se aplica.

---

## H2 — Correspondência entre o sistema e o mundo real

> O sistema deve falar a linguagem do usuário, com palavras, frases e conceitos familiares ao mundo real, em vez de termos orientados à máquina.

### Resultado

**Nenhum problema significativo identificado.**

Os principais termos utilizados pelo sistema, como **"Adotante"**, **"Gatos"**, **"Cães"** e **"Animais"**, apresentam relação direta com o contexto de adoção de animais.

Durante a avaliação, não foi identificado um uso significativo de termos técnicos ou orientados à máquina que dificultasse a compreensão das funcionalidades principais.

**Severidade:** Não se aplica.

**Evidência:** Não se aplica.

---

## H3 — Controle e liberdade do usuário

> Os usuários frequentemente escolhem funções por engano e precisam de uma "saída de emergência" clara para deixar o estado indesejado sem precisar passar por um processo longo.

### Problema identificado

**Dificuldade para trocar o tipo de acesso durante o login.**

Na tela de login, o sistema apresenta a indicação **"Área do Adotante"**. Para acessar outro tipo de área, como a área administrativa, o usuário precisa utilizar a opção **"Voltar ao início"** e retornar à página anterior para realizar uma nova escolha.

Isso aumenta a quantidade de etapas necessárias para alterar o contexto de acesso.

**Tela:** Login — `/login?tipo=ADOTANTE`

**Heurística:** H3 — Controle e liberdade do usuário

**Severidade:** 2 — Média

**Evidência:** `evidencias/h02-login-perfil.png`

### Impacto

O usuário precisa abandonar o fluxo atual e retornar à página inicial para selecionar outro tipo de acesso, em vez de possuir uma alternativa mais direta na própria tela de login.

---

## H4 — Consistência e padrões

> Os usuários não devem ter que adivinhar se diferentes palavras, situações ou ações significam a mesma coisa. Siga convenções de plataforma.

### Problema identificado

**Diferença visual entre as opções de acesso na página inicial.**

Na seção **"Como deseja acessar?"**, são apresentadas as opções **"Sou Adotante"** e **"Sou Administrador"**.

Os botões utilizam estilos e cores diferentes. Embora a utilização de cores distintas não constitua, isoladamente, um erro de usabilidade, a apresentação pode tornar a hierarquia visual entre os caminhos de acesso menos uniforme.

Esse ponto foi considerado uma oportunidade de melhoria da consistência visual da interface.

**Tela:** Página inicial — `/`

**Heurística:** H4 — Consistência e padrões

**Severidade:** 2 — Média

**Evidência:** `evidencias/h01-home-botoes.png`

### Observação

A diferença de cores não foi considerada, por si só, uma falha funcional. O problema está relacionado à possibilidade de estabelecer uma apresentação mais consistente entre opções que fazem parte do mesmo grupo de acesso.

---

## H5 — Prevenção de erros

> Mais do que boas mensagens de erro, é preciso um design cuidadoso que previna a ocorrência de falhas antes mesmo que o usuário faça a ação.

### Problema identificado

**Ação de exclusão da conta apresentada junto às ações rotineiras.**

No dashboard do usuário, a opção **"Excluir minha conta"** aparece na mesma área geral das demais funcionalidades.

Por se tratar de uma ação potencialmente destrutiva, sua apresentação junto às ações rotineiras pode exigir uma diferenciação maior e uma etapa de confirmação antes da execução.

**Tela:** Dashboard — `/dashboard`

**Heurística:** H5 — Prevenção de erros

**Severidade:** 3 — Alta

**Evidência:** `evidencias/h04-dashboard-exclusao.png`

### Impacto

A exclusão de uma conta possui consequências maiores que ações comuns de navegação ou consulta. Uma diferenciação visual e uma confirmação explícita podem reduzir a possibilidade de execução não intencional.

---

## H6 — Reconhecimento em vez de memorização

> Minimize a carga de memória do usuário tornando objetos, ações e opções visíveis.

### Problema identificado

**Necessidade de selecionar uma espécie antes de visualizar os animais.**

Na área de animais, o usuário precisa selecionar uma categoria, como **"Gatos"** ou **"Cães"**, antes de acessar os respectivos animais.

Embora as opções estejam visíveis, o fluxo exige que o usuário tome uma decisão inicial de categoria antes de visualizar o conjunto de animais disponíveis.

**Tela:** `/animais`

**Heurística:** H6 — Reconhecimento em vez de memorização

**Severidade:** 2 — Média

**Evidência:** `evidencias/h05-listagem-especies.png`

### Impacto

Para usuários que desejam apenas explorar os animais disponíveis, a necessidade de escolher previamente uma categoria adiciona uma etapa ao processo de descoberta.

---

## H7 — Flexibilidade e eficiência de uso

> Aceleradores — ocultos para o usuário novato — podem agilizar a interação para o usuário experiente.

### Problema identificado

**Fluxo de exploração dos animais sem uma alternativa mais direta.**

Na área de animais, o usuário precisa seguir o fluxo de seleção de uma espécie para acessar os resultados correspondentes.

Não foi identificada uma alternativa adicional para usuários que desejam explorar rapidamente os animais disponíveis sem iniciar a navegação por uma espécie específica.

Esse ponto representa uma oportunidade de melhoria na flexibilidade do fluxo.

**Tela:** `/animais`

**Heurística:** H7 — Flexibilidade e eficiência de uso

**Severidade:** 1 — Baixa

**Evidência:** `evidencias/h05-listagem-especies.png`

---

## H8 — Estética e design minimalista

> Os diálogos não devem conter informações que são irrelevantes ou pouco usadas.

### Problema identificado

**Diferença visual entre campos preenchidos e não preenchidos no cadastro.**

Na tela de cadastro, os campos **"Nome"** e **"E-mail"**, quando preenchidos, apresentam uma aparência de fundo diferente do campo **"Senha"**.

Essa diferença visual pode fazer com que os campos preenchidos sejam interpretados como desabilitados ou somente leitura, mesmo quando continuam fazendo parte do formulário.

**Tela:** Cadastro — `/cadastro/ADOTANTE`

**Heurística:** H8 — Estética e design minimalista

**Severidade:** 2 — Média

**Evidência:** `evidencias/h03-cadastro-inputs.png`

### Impacto

A diferença visual entre os campos pode gerar dúvida sobre quais campos estão disponíveis para edição e sobre o estado atual do formulário.

---

## H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar-se de erros

> As mensagens de erro devem ser expressas em linguagem simples, indicar precisamente o problema e sugerir uma solução construtiva.

### Problema identificado

**Mensagem de erro "Token inválido ou expirado."**

Durante uma tentativa de cadastro, o sistema apresentou a mensagem:

> **"Token inválido ou expirado."**

A mensagem utiliza o termo técnico **"token"** sem explicar ao usuário o que ocorreu ou qual procedimento deve ser realizado para solucionar o problema.

Além disso, a mensagem não apresenta uma orientação clara de recuperação, como tentar novamente ou realizar outra ação específica.

**Tela:** Cadastro

**Heurística:** H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar-se de erros

**Severidade:** 2 — Média

**Evidência:** `evidencias/h08-erro-token.png`

### Impacto

Um usuário sem conhecimento técnico pode não compreender o significado de "token" nem saber como recuperar-se do erro apresentado.

### Observação

A avaliação registra o **comportamento observado na interface**. A causa técnica responsável pela mensagem não é determinada nesta avaliação heurística.

---

## H10 — Ajuda e documentação

> É melhor que o sistema não precise de explicação adicional, mas pode ser necessário fornecer ajuda e documentação fáceis de buscar.

### Resultado

**Nenhum problema significativo identificado durante a avaliação.**

Nas telas analisadas, não foi identificado um problema específico relacionado à ausência de orientação que impedisse a compreensão das funcionalidades avaliadas.

Também não foi considerado como problema, por si só, o fato de determinadas funcionalidades não apresentarem documentação adicional quando puderam ser compreendidas pela própria interface.

**Severidade:** Não se aplica.

**Evidência:** Não se aplica.

---

# 5. Avaliação complementar — estados e formulários

Além dos problemas principais apresentados nas heurísticas anteriores, foram registradas duas evidências complementares durante a inspeção da interface.

## 5.1 Estado de lista sem resultados

A interface foi analisada em uma situação na qual não havia animais disponíveis para determinada categoria.

A tela apresentou a informação de que não havia animais disponíveis, mantendo elementos de navegação e filtragem na interface.

**Evidência:** `evidencias/h06-lista-vazia.png`

Essa situação foi considerada um **ponto de atenção de baixa severidade**, pois os elementos permanecem visíveis mesmo quando não existem resultados para apresentar.

**Severidade:** 1 — Baixa.

---

## 5.2 Indicação de campos obrigatórios

Também foi analisado o formulário de cadastro quanto à indicação visual dos campos obrigatórios.

A interface não apresenta uma indicação visual explícita junto aos campos, como um asterisco (`*`) ou a expressão **"obrigatório"**, para informar antecipadamente ao usuário quais informações são necessárias.

Essa característica pode aumentar a incerteza durante o preenchimento do formulário, principalmente para usuários que não sabem quais campos são exigidos antes de tentar enviar os dados.

**Evidência:** `evidencias/h07-campos-obrigatorios.png`

**Severidade:** 2 — Média.

### Observação

Essa evidência é considerada principalmente como um ponto relacionado à **prevenção de erros (H5)**, pois uma indicação antecipada dos campos obrigatórios pode ajudar o usuário a preencher corretamente o formulário antes do envio.

---

# 6. Resumo dos problemas identificados

| ID  | Heurística                                | Problema observado                                                   | Severidade | Evidência                     |
| --- | ----------------------------------------- | -------------------------------------------------------------------- | ---------: | ----------------------------- |
| P01 | H3 — Controle e liberdade                 | Dificuldade para trocar o tipo de acesso durante o login             |          2 | `h02-login-perfil.png`        |
| P02 | H4 — Consistência e padrões               | Diferença de apresentação visual entre opções de acesso              |          2 | `h01-home-botoes.png`         |
| P03 | H5 — Prevenção de erros                   | Exclusão da conta apresentada junto às ações rotineiras              |          3 | `h04-dashboard-exclusao.png`  |
| P04 | H5 — Prevenção de erros                   | Ausência de indicação visual dos campos obrigatórios                 |          2 | `h07-campos-obrigatorios.png` |
| P05 | H6 — Reconhecimento em vez de memorização | Necessidade de selecionar uma espécie para acessar os animais        |          2 | `h05-listagem-especies.png`   |
| P06 | H7 — Flexibilidade e eficiência           | Fluxo de exploração dos animais sem alternativa mais direta          |          1 | `h05-listagem-especies.png`   |
| P07 | H8 — Estética e design minimalista        | Diferença visual entre campos preenchidos e não preenchidos          |          2 | `h03-cadastro-inputs.png`     |
| P08 | H9 — Recuperação de erros                 | Mensagem "Token inválido ou expirado." sem orientação de recuperação |          2 | `h08-erro-token.png`          |
| P09 | H5 — Prevenção de erros                   | Elementos de filtro mantidos em estado de lista sem resultados       |          1 | `h06-lista-vazia.png`         |

---

# 7. Síntese por heurística

| Heurística                                                  | Resultado                                  |
| ----------------------------------------------------------- | ------------------------------------------ |
| **H1 — Visibilidade do status do sistema**                  | Nenhum problema significativo identificado |
| **H2 — Correspondência entre sistema e mundo real**         | Nenhum problema significativo identificado |
| **H3 — Controle e liberdade do usuário**                    | Problema identificado                      |
| **H4 — Consistência e padrões**                             | Problema identificado                      |
| **H5 — Prevenção de erros**                                 | Problemas identificados                    |
| **H6 — Reconhecimento em vez de memorização**               | Problema identificado                      |
| **H7 — Flexibilidade e eficiência de uso**                  | Ponto de atenção identificado              |
| **H8 — Estética e design minimalista**                      | Problema identificado                      |
| **H9 — Reconhecimento, diagnóstico e recuperação de erros** | Problema identificado                      |
| **H10 — Ajuda e documentação**                              | Nenhum problema significativo identificado |

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

Dessa forma, os resultados apresentados representam as condições observadas durante a avaliação e não devem ser interpretados como uma análise exaustiva de todas as funcionalidades internas do sistema.

---

# 9. Evidências

As capturas de tela utilizadas como evidências estão armazenadas no diretório:

```text
docs/redesign/evidencias/
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

As imagens correspondem às situações observadas durante a avaliação e são utilizadas para documentar visualmente os pontos de atenção identificados.

---

# 10. Considerações finais

A avaliação heurística permitiu identificar pontos da interface atual do Whiskerworld que podem ser considerados na etapa posterior de redesign.

Os principais pontos observados estão relacionados a:

* controle do fluxo de acesso;
* consistência visual;
* prevenção de ações potencialmente destrutivas;
* indicação de campos obrigatórios;
* exploração e navegação pelos animais;
* tratamento de estados sem resultados;
* apresentação visual dos campos de formulário;
* clareza das mensagens de erro.

Também foram registradas as heurísticas nas quais **não foram identificados problemas significativos**, garantindo que as 10 heurísticas de Nielsen fossem consideradas na avaliação.

Os resultados desta etapa servirão como referência para o redesign, permitindo que as alterações posteriores sejam justificadas com base nos problemas identificados e relacionadas às respectivas heurísticas de usabilidade.

A avaliação representa o estado observado do sistema antes das modificações de redesign.
