# Avaliação Heurística do Sistema Atual — Whiskerworld

## 1. Objetivo

Esta avaliação tem como objetivo analisar a interface atual do sistema **Whiskerworld** antes da etapa de redesign, identificando problemas de usabilidade com base nas **10 Heurísticas de Usabilidade de Nielsen**.

A análise busca registrar os pontos observados na versão atual do sistema, incluindo problemas de usabilidade, seu impacto, nível de severidade e evidências visuais.

Os resultados desta avaliação servirão como base para a etapa posterior de redesign, permitindo relacionar as alterações realizadas aos problemas de usabilidade identificados e às respectivas heurísticas de usabilidade.

Esta etapa contempla a **avaliação heurística do sistema atual**, não incluindo a implementação do redesign, novas funcionalidades ou melhorias de acessibilidade.

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
* evidência visual.

Quando não foi identificado um problema significativo, a heurística foi registrada como **"Nenhum problema significativo identificado"**.

---

# 3. Heurísticas de Usabilidade

## H1 — Visibilidade do status do sistema

> O sistema deve sempre manter o usuário informado sobre o que está acontecendo através de feedback adequado em um tempo razoável.

**Resultado:** Nenhum problema significativo identificado durante a avaliação.

---

## H2 — Correspondência entre o sistema e o mundo real

> O sistema deve falar a linguagem do usuário, com palavras, frases e conceitos familiares ao mundo real, em vez de termos orientados à máquina.

**Resultado:** Nenhum problema significativo identificado durante a avaliação.

---

## H3 — Controle e liberdade do usuário

> Os usuários frequentemente escolhem funções por engano e precisam de uma "saída de emergência" clara para deixar o estado indesejado sem precisar passar por um processo longo.

**Tela/fluxo analisado:** Página inicial → Login

**URL:** `http://localhost:5173/login?tipo=ADOTANTE`

### Fluxo atual

1. O usuário acessa a página inicial.
2. Na seção **"Como deseja acessar?"**, seleciona **"Sou Adotante"**.
3. O sistema direciona para a tela de login.
4. A tela apresenta o título **"Área do Adotante"**.
5. Para retornar e escolher outro tipo de acesso, o usuário precisa utilizar a opção **"← Voltar ao início"**.
6. Não há uma opção direta na própria tela de login para alternar entre os perfis de acesso.

### Problema identificado

A escolha do tipo de acesso realizada na página inicial fica condicionada ao fluxo escolhido anteriormente. Caso o usuário tenha selecionado o perfil incorreto, precisa retornar à página inicial para realizar uma nova escolha.

Isso reduz o controle do usuário sobre a navegação, principalmente quando ele percebe o engano somente após chegar à tela de login.

**Severidade:** 2 — Problema menor.

**Evidência:** `evidencias/h02-login-perfil.png`

---

## H4 — Consistência e padrões

> Os usuários não devem ter que adivinhar se diferentes palavras, situações ou ações significam a mesma coisa. Siga convenções de plataforma.

**Tela/fluxo analisado:** Página inicial

**URL:** `http://localhost:5173/`

### Fluxo atual

1. O usuário acessa a página inicial.
2. Encontra a seção **"Como deseja acessar?"**.
3. São apresentados dois caminhos:

   * **"Sou Adotante"** → botão **"ENCONTRAR PETS"**;
   * **"Sou Administrador"** → botão **"ACESSAR PAINEL"**.
4. Cada opção utiliza uma cor diferente para o botão.

### Problema identificado

Os dois caminhos de acesso apresentam padrões visuais diferentes, principalmente nas cores dos botões e na forma como as ações são destacadas.

Embora os destinos sejam diferentes, a diferença visual pode fazer com que o usuário interprete os elementos como componentes pertencentes a padrões distintos dentro da mesma interface.

**Severidade:** 2 — Problema menor.

**Evidência:** `evidencias/h01-home-botoes.png`

---

## H5 — Prevenção de erros

> Mais do que boas mensagens de erro, é preciso um design cuidadoso que previna a ocorrência de falhas antes mesmo que o usuário puxe a ação.

### H5.1 — Exclusão da conta

**Tela/fluxo analisado:** Dashboard do usuário

**URL:** `http://localhost:5173/dashboard`

### Fluxo atual

1. O usuário acessa o dashboard.
2. A tela apresenta diferentes opções relacionadas à utilização da conta.
3. Entre essas opções está **"Excluir minha conta"**.
4. A ação de exclusão aparece no mesmo espaço geral das demais opções do usuário.

### Problema identificado

A ação de exclusão da conta, por ser uma operação destrutiva, aparece próxima às demais ações da interface, sem uma diferenciação visual evidente observada na tela analisada.

Isso pode aumentar o risco de o usuário interpretar a ação como uma operação comum.

**Severidade:** 3 — Problema grave.

**Evidência:** `evidencias/h04-dashboard-exclusao.png`

---

### H5.2 — Identificação dos campos obrigatórios

**Tela/fluxo analisado:** Cadastro de adotante

**URL:** `http://localhost:5173/cadastro/ADOTANTE`

### Fluxo atual

1. O usuário acessa o formulário de cadastro.
2. São apresentados campos como **Nome**, **E-mail** e **Senha**.
3. Os campos não apresentam uma indicação visual explícita, como `*` ou a palavra **"obrigatório"**, para informar quais são necessários.

### Problema identificado

O formulário não apresenta uma indicação visual direta dos campos obrigatórios. Dessa forma, o usuário precisa descobrir essa informação durante o preenchimento ou a tentativa de envio do formulário.

**Severidade:** 2 — Problema menor.

**Evidência:** `evidencias/h07-campos-obrigatorios.png`

---

### H5.3 — Lista sem resultados

**Tela/fluxo analisado:** Listagem de animais

**URL:** `http://localhost:5173/animais/GATO`

### Fluxo atual

1. O usuário acessa a área de animais.
2. Seleciona a categoria **"Gatos"**.
3. O sistema apresenta a indicação **"0 disponíveis"** e **"Nenhum gato disponível"**.
4. Os elementos de navegação e filtragem continuam disponíveis na tela.

### Problema identificado

Quando não existem animais disponíveis para a categoria selecionada, o sistema apresenta a ausência de resultados, mas mantém os elementos de filtragem e navegação disponíveis.

Essa situação pode deixar o usuário sem uma indicação clara sobre o que fazer após não encontrar resultados.

**Severidade:** 1 — Problema cosmético/baixo impacto.

**Evidência:** `evidencias/h06-lista-vazia.png`

---

## H6 — Reconhecimento em vez de memorização

> Minimize a carga de memória do usuário tornando objetos, ações e opções visíveis.

**Tela/fluxo analisado:** Listagem de animais

**URL:** `http://localhost:5173/animais`

### Fluxo atual

1. O usuário acessa a área de animais.
2. A interface apresenta as opções **"Gatos"** e **"Cães"**.
3. Para visualizar os animais, o usuário precisa selecionar uma das categorias.
4. Não é apresentada uma opção direta de **"Ver todos"** na tela analisada.

### Problema identificado

A navegação inicial da área de animais depende da escolha de uma categoria antes da visualização dos animais.

O usuário precisa compreender que deve selecionar **"Gatos"** ou **"Cães"** para prosseguir, em vez de visualizar diretamente todos os animais disponíveis e utilizar as categorias como filtros.

**Severidade:** 2 — Problema menor.

**Evidência:** `evidencias/h05-listagem-especies.png`

---

## H7 — Flexibilidade e eficiência de uso

> Aceleradores — ocultos para o usuário novato — podem agilizar a interação para o usuário experiente.

**Tela/fluxo analisado:** Listagem de animais

**URL:** `http://localhost:5173/animais`

### Fluxo atual

1. O usuário acessa a listagem de animais.
2. As opções disponíveis inicialmente são as categorias **"Gatos"** e **"Cães"**.
3. O usuário precisa entrar em uma categoria para continuar a navegação.
4. Não é apresentada uma alternativa direta para explorar todos os animais em uma única listagem.

### Problema identificado

A interface oferece apenas a navegação por categoria como caminho inicial para explorar os animais.

A ausência de uma alternativa de exploração mais direta reduz a flexibilidade do fluxo, principalmente para usuários que desejam apenas visualizar os animais disponíveis sem definir previamente uma espécie.

**Severidade:** 2 — Problema menor.

**Evidência:** `evidencias/h05-listagem-especies.png`

---

## H8 — Estética e design minimalista

> Os diálogos não devem conter informações que são irrelevantes ou pouco usadas.

**Tela/fluxo analisado:** Cadastro de adotante

**URL:** `http://localhost:5173/cadastro/ADOTANTE`

### Fluxo atual

1. O usuário acessa o formulário de cadastro.
2. Os campos **Nome** e **E-mail** aparecem preenchidos.
3. Esses campos apresentam uma coloração de fundo diferente do campo **Senha**.
4. A diferença visual pode fazer com que os campos preenchidos sejam interpretados como desabilitados ou somente leitura.

### Problema identificado

Os campos do formulário apresentam estados visuais diferentes sem uma indicação suficientemente clara do significado dessa diferença.

A alteração visual dos campos preenchidos pode gerar dúvida sobre a possibilidade de edição dos valores.

**Severidade:** 2 — Problema menor.

**Evidência:** `evidencias/h03-cadastro-inputs.png`

---

## H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar erros

> As mensagens de erro devem ser expressas em linguagem simples (sem códigos), indicar precisamente o problema e sugerir uma solução construtiva.

**Tela/fluxo analisado:** Cadastro/Login

### Fluxo atual

1. O usuário realiza uma tentativa de cadastro/login.
2. O sistema apresenta a mensagem:
   **"Token inválido ou expirado."**

### Problema identificado

A mensagem apresentada utiliza o termo técnico **"Token"**, que pode não ser compreendido por usuários comuns.

Além disso, a mensagem informa a condição do erro, mas não apresenta uma orientação clara sobre o que o usuário deve fazer para recuperar o acesso ou continuar o fluxo.

**Severidade:** 3 — Problema grave.

**Evidência:** `evidencias/h08-erro-token.png`

---

## H10 — Ajuda e documentação

> É melhor que o sistema não precise de explicação adicional, mas pode ser necessário fornecer ajuda e documentação fáceis de buscar.

**Resultado:** Nenhum problema significativo identificado durante a avaliação.

---

# 4. Síntese dos problemas identificados

| ID  | Heurística | Problema                                                                      | Severidade | Evidência                     |
| --- | ---------- | ----------------------------------------------------------------------------- | ---------: | ----------------------------- |
| P01 | H3         | Fluxo pouco direto para trocar o tipo de acesso após uma escolha inicial      |          2 | `h02-login-perfil.png`        |
| P02 | H4         | Diferenças no padrão visual dos caminhos de acesso                            |          2 | `h01-home-botoes.png`         |
| P03 | H5         | Ação de exclusão da conta próxima às ações comuns                             |          3 | `h04-dashboard-exclusao.png`  |
| P04 | H5         | Campos obrigatórios sem indicação visual explícita                            |          2 | `h07-campos-obrigatorios.png` |
| P05 | H5         | Estado de lista vazia sem orientação clara sobre a continuidade do fluxo      |          1 | `h06-lista-vazia.png`         |
| P06 | H6         | Navegação inicial depende da escolha de uma categoria                         |          2 | `h05-listagem-especies.png`   |
| P07 | H7         | Ausência de caminho alternativo para exploração direta dos animais            |          2 | `h05-listagem-especies.png`   |
| P08 | H8         | Diferença visual entre campos preenchidos e não preenchidos pode gerar dúvida |          2 | `h03-cadastro-inputs.png`     |
| P09 | H9         | Mensagem de erro utiliza termo técnico e não orienta claramente a recuperação |          3 | `h08-erro-token.png`          |

---

# 5. Evidências

As capturas utilizadas na avaliação estão disponíveis no diretório:

`docs/tp4-manutenção-evolutiva/redesign/evidencias/`

* `h01-home-botoes.png`
* `h02-login-perfil.png`
* `h03-cadastro-inputs.png`
* `h04-dashboard-exclusao.png`
* `h05-listagem-especies.png`
* `h06-lista-vazia.png`
* `h07-campos-obrigatorios.png`
* `h08-erro-token.png`

---

# 6. Limitações da avaliação

Alguns fluxos não puderam ser avaliados completamente durante a análise:

* detalhes dos animais, devido à ausência de animais disponíveis;
* fluxo de agendamento, devido à ausência de animais/horários disponíveis;
* funcionalidades administrativas, devido à indisponibilidade das credenciais necessárias;
* operações de CRUD de animais;
* login com Google;
* sistema de favoritos;
* alguns cenários de erro e carregamento que não puderam ser reproduzidos diretamente.

Dessa forma, os problemas registrados neste documento correspondem aos comportamentos que puderam ser observados durante a avaliação da versão atual do sistema.

---

# 7. Considerações finais

A avaliação identificou problemas relacionados principalmente ao controle do usuário, consistência visual, prevenção de erros, flexibilidade de navegação, apresentação dos formulários e tratamento de mensagens de erro.

Os problemas identificados e suas respectivas evidências servem como registro da situação atual do sistema antes da etapa de redesign.
