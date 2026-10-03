# Avaliação Heurística do Sistema Atual — Whiskerworld

## 1. Objetivo

Esta etapa tem como objetivo realizar uma avaliação heurística da versão atual do sistema Whiskerworld, antes da aplicação das mudanças de redesign previstas no trabalho de Manutenção Evolutiva.

A avaliação busca identificar problemas de usabilidade na interface atual, utilizando como referência as 10 heurísticas de usabilidade de Jakob Nielsen. Para cada problema identificado, são apresentadas a heurística relacionada, a descrição da situação observada, a evidência por meio de captura de tela e o nível de severidade.

O resultado desta avaliação servirá como diagnóstico da versão atual do sistema e como base para a etapa posterior de redesign.

---

## 2. Metodologia

A avaliação foi realizada por meio da inspeção das principais telas e fluxos disponíveis na versão atual do Whiskerworld.

Foram exploradas funcionalidades relacionadas ao acesso ao sistema, autenticação, cadastro, dashboard, listagem de animais, interação com os animais e mensagens apresentadas pelo sistema.

Durante a inspeção, cada interação foi comparada com as 10 heurísticas de usabilidade de Nielsen, buscando identificar situações em que a interface pudesse gerar dificuldade de compreensão, navegação, interação ou recuperação de erros.

Para cada problema encontrado, foi registrada uma captura de tela correspondente e atribuída uma severidade utilizando uma escala de 0 a 4.

---

# 3. Escala de Severidade

| Severidade | Classificação         | Descrição                                                                                |
| ---------- | --------------------- | ---------------------------------------------------------------------------------------- |
| 0          | Não é um problema     | Não representa uma violação de usabilidade.                                              |
| 1          | Cosmético             | Problema visual ou de baixa importância, sem impacto significativo na utilização.        |
| 2          | Problema menor        | Pode causar alguma dificuldade, mas não impede a realização da tarefa.                   |
| 3          | Problema grave        | Pode prejudicar significativamente a realização da tarefa ou causar confusão ao usuário. |
| 4          | Problema catastrófico | Impede ou compromete fortemente a utilização da funcionalidade.                          |

---

# 4. Avaliação das 10 Heurísticas

## H1 — Visibilidade do status do sistema

**Definição:**
O sistema deve sempre manter o usuário informado sobre o que está acontecendo através de feedback adequado em um tempo razoável.

### Resultado da avaliação

Durante a inspeção das principais funcionalidades, não foi identificado um problema significativo que pudesse ser caracterizado como uma violação direta desta heurística.

As interações avaliadas apresentam retorno visual ou mudança de estado suficiente para que o usuário compreenda, de maneira geral, o resultado de suas ações.

**Resultado:** Nenhum problema significativo identificado.

---

## H2 — Correspondência entre o sistema e o mundo real

**Definição:**
O sistema deve falar a linguagem do usuário, com palavras, frases e conceitos familiares ao mundo real, em vez de utilizar termos orientados à máquina.

### Resultado da avaliação

Os termos utilizados nas principais telas são compatíveis com o contexto do sistema, utilizando conceitos como adoção, animais, gatos, cães, administrador e conta.

Não foi identificado um problema significativo relacionado à utilização de termos técnicos ou conceitos que não correspondam ao contexto esperado pelo usuário.

**Resultado:** Nenhum problema significativo identificado.

---

## H3 — Controle e liberdade do usuário

**Definição:**
Os usuários frequentemente escolhem funções por engano e precisam de uma "saída de emergência" clara para deixar o estado indesejado sem precisar passar por um processo longo.

### P01 — Troca de perfil exige retorno à tela inicial

**Problema:**
Após acessar a área de um determinado perfil, a troca para outro tipo de acesso depende do retorno à tela inicial para selecionar novamente o perfil desejado.

Essa estrutura reduz a liberdade do usuário para alternar diretamente entre os contextos de utilização do sistema.

**Evidência:** `h02-login-perfil.png`

**Severidade:** 2 — Problema menor.

---

## H4 — Consistência e padrões

**Definição:**
Os usuários não devem ter que adivinhar se diferentes palavras, situações ou ações significam a mesma coisa. O sistema deve seguir convenções e padrões.

### P02 — Diferença visual entre os acessos de perfil

**Problema:**
Na tela inicial, as opções "Sou Adotante" e "Sou Administrador" apresentam estilos visuais diferentes, especialmente em relação às cores dos botões.

Essa diferença pode dificultar a percepção de que as duas opções representam alternativas equivalentes de acesso ao sistema.

**Evidência:** `h01-home-botoes.png`

**Severidade:** 2 — Problema menor.

### P03 — Campos obrigatórios sem indicação visual padronizada

**Problema:**
No formulário de cadastro, os campos obrigatórios não apresentam uma indicação visual explícita, como um asterisco (*) ou a identificação "obrigatório".

Isso pode dificultar a identificação dos campos que precisam necessariamente ser preenchidos pelo usuário.

**Evidência:** `h07-campos-obrigatorios.png`

**Severidade:** 2 — Problema menor.

---

## H5 — Prevenção de erros

**Definição:**
Mais do que boas mensagens de erro, é preciso um design cuidadoso que previna a ocorrência de falhas antes mesmo que o usuário realize uma ação.

### P04 — Ação de exclusão de conta exposta no dashboard

**Problema:**
A opção "Excluir minha conta" aparece junto às demais ações disponíveis no dashboard.

Por se tratar de uma ação potencialmente irreversível e de alto impacto, sua apresentação junto às ações comuns aumenta a possibilidade de o usuário selecioná-la de maneira não intencional.

**Evidência:** `h04-dashboard-exclusao.png`

**Severidade:** 3 — Problema grave.

---

## H6 — Reconhecimento em vez de memorização

**Definição:**
O sistema deve minimizar a carga de memória do usuário tornando objetos, ações e opções visíveis.

### Resultado da avaliação

Durante a inspeção, não foi identificado um problema suficientemente relevante e independente dos demais achados para ser registrado como uma violação específica desta heurística.

**Resultado:** Nenhum problema significativo identificado.

---

## H7 — Flexibilidade e eficiência de uso

**Definição:**
A interface deve oferecer formas eficientes de interação, permitindo que usuários mais experientes realizem suas tarefas de maneira mais rápida.

### P05 — Navegação da listagem depende da seleção de espécie

**Problema:**
Na área de listagem de animais, o usuário é direcionado inicialmente para a escolha entre categorias como "Gatos" e "Cães".

Não é apresentada uma alternativa direta para visualizar todos os animais de uma única vez, o que acrescenta uma etapa à exploração do conteúdo.

**Evidência:** `h05-listagem-especies.png`

**Severidade:** 2 — Problema menor.

---

## H8 — Estética e design minimalista

**Definição:**
Os diálogos e elementos da interface não devem conter informações irrelevantes ou apresentar elementos de maneira que prejudique a compreensão e a interação.

### P06 — Estado visual dos campos preenchidos pode gerar dúvida

**Problema:**
Na tela de cadastro, determinados campos preenchidos apresentam uma aparência visual diferente de outros campos do formulário.

Essa diferença de apresentação pode fazer com que o usuário tenha dúvidas sobre o estado do campo, especialmente sobre se ele está disponível para edição ou se possui alguma restrição.

**Evidência:** `h03-cadastro-inputs.png`

**Severidade:** 2 — Problema menor.

### P07 — Botão de favorito apresenta baixa visibilidade

**Problema:**
O botão utilizado para favoritar um animal apresenta baixa visibilidade devido à sua aparência quase transparente em relação aos demais elementos da interface.

Essa característica pode dificultar que o usuário identifique rapidamente a função e perceba que o elemento é interativo.

**Evidência:** captura de tela da tela do animal em que o botão de favorito aparece quase transparente.

**Severidade:** 2 — Problema menor.

---

## H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar erros

**Definição:**
As mensagens de erro devem ser expressas em linguagem simples, indicar precisamente o problema e sugerir uma solução construtiva.

### P08 — Mensagem de erro técnica sem orientação para recuperação

**Problema:**
Durante uma situação de erro, o sistema apresenta a mensagem:

> "Token inválido ou expirado."

A mensagem utiliza um termo técnico que pode não ser compreendido pelo usuário comum e não apresenta uma orientação clara sobre como solucionar o problema ou qual ação deve ser realizada em seguida.

**Evidência:** `h08-erro-token.png`

**Severidade:** 3 — Problema grave.

---

## H10 — Ajuda e documentação

**Definição:**
É melhor que o sistema não precise de explicação adicional, mas pode ser necessário fornecer ajuda e documentação fáceis de buscar.

### Resultado da avaliação

Durante a inspeção das funcionalidades avaliadas, não foi identificado um problema significativo relacionado especificamente à ausência ou inadequação de ajuda e documentação.

**Resultado:** Nenhum problema significativo identificado.

---

# 5. Tabela Consolidada

| ID  | Heurística | Problema identificado                                    | Evidência                     | Severidade |
| --- | ---------- | -------------------------------------------------------- | ----------------------------- | ---------- |
| P01 | H3         | Troca de perfil exige retorno à tela inicial             | `h02-login-perfil.png`        | 2          |
| P02 | H4         | Diferença visual entre os acessos de perfil              | `h01-home-botoes.png`         | 2          |
| P03 | H4         | Campos obrigatórios sem indicação visual                 | `h07-campos-obrigatorios.png` | 2          |
| P04 | H5         | Ação de exclusão de conta exposta no dashboard           | `h04-dashboard-exclusao.png`  | 3          |
| P05 | H7         | Navegação depende da seleção de espécie                  | `h05-listagem-especies.png`   | 2          |
| P06 | H8         | Estado visual dos campos preenchidos pode gerar dúvida   | `h03-cadastro-inputs.png`     | 2          |
| P07 | H8         | Botão de favorito apresenta baixa visibilidade           | Foto do animal com favorito   | 2          |
| P08 | H9         | Mensagem de erro técnica sem orientação para recuperação | `h08-erro-token.png`          | 3          |

---

# 6. Distribuição por Severidade

Considerando os 8 problemas identificados:

* **Severidade 3 — Problema grave:** 2 problemas
* **Severidade 2 — Problema menor:** 6 problemas
* **Severidade 1 — Cosmético:** 0 problemas
* **Severidade 4 — Catastrófico:** 0 problemas

A maior parte dos problemas identificados apresenta impacto moderado sobre a experiência de uso, enquanto dois problemas foram classificados como graves por apresentarem potencial de causar consequências mais relevantes durante a utilização do sistema.

---

# 7. Cobertura das Heurísticas

| Heurística                                | Situação                   |
| ----------------------------------------- | -------------------------- |
| H1 — Visibilidade do status do sistema    | Sem problema significativo |
| H2 — Correspondência com o mundo real     | Sem problema significativo |
| H3 — Controle e liberdade                 | P01                        |
| H4 — Consistência e padrões               | P02, P03                   |
| H5 — Prevenção de erros                   | P04                        |
| H6 — Reconhecimento em vez de memorização | Sem problema significativo |
| H7 — Flexibilidade e eficiência           | P05                        |
| H8 — Estética e design minimalista        | P06, P07                   |
| H9 — Recuperação de erros                 | P08                        |
| H10 — Ajuda e documentação                | Sem problema significativo |

---

# 8. Evidências Fotográficas

As capturas utilizadas na avaliação são:

### `h01-home-botoes.png`

Utilizada para evidenciar o **P02**, relacionado à diferença visual entre as opções de acesso aos perfis.

### `h02-login-perfil.png`

Utilizada para evidenciar o **P01**, relacionado à dificuldade de alternância entre perfis.

### `h03-cadastro-inputs.png`

Utilizada para evidenciar o **P06**, relacionado à apresentação visual dos campos preenchidos.

### `h04-dashboard-exclusao.png`

Utilizada para evidenciar o **P04**, relacionado à exposição da ação de exclusão da conta.

### `h05-listagem-especies.png`

Utilizada para evidenciar o **P05**, relacionado à necessidade de selecionar uma espécie antes de explorar a listagem.

### `h07-campos-obrigatorios.png`

Utilizada para evidenciar o **P03**, relacionado à ausência de indicação visual dos campos obrigatórios.

### `h08-erro-token.png`

Utilizada para evidenciar o **P08**, relacionado à mensagem técnica apresentada pelo sistema.

### Captura do botão de favorito

Deve ser adicionada para evidenciar o **P07**, mostrando o botão de favorito com aparência quase transparente na interface de interação com o animal.

---

# 9. Limitações da Avaliação

A avaliação foi realizada por meio da inspeção das funcionalidades disponíveis na versão atual do sistema e não representa, isoladamente, uma pesquisa formal com usuários reais.

Os problemas foram identificados a partir da comparação das interfaces e fluxos observados com as heurísticas de Nielsen.

A ausência de problemas registrados em determinadas heurísticas não significa que o sistema não possa apresentar outros problemas de usabilidade nessas categorias, mas que não foram identificadas violações suficientemente relevantes durante o escopo desta avaliação.

---

# 10. Considerações Finais

A avaliação heurística da versão atual do Whiskerworld identificou **8 problemas de usabilidade**, distribuídos entre as heurísticas H3, H4, H5, H7, H8 e H9.

Os problemas encontrados estão relacionados principalmente à liberdade de navegação, consistência visual, prevenção de ações potencialmente prejudiciais, flexibilidade de navegação, apresentação dos elementos de interação e comunicação de erros.

Entre os problemas identificados, destacam-se a dificuldade de alternância entre perfis, a exposição da exclusão de conta, a ausência de indicação dos campos obrigatórios, a baixa visibilidade do botão de favorito e a utilização de uma mensagem técnica para comunicar um erro.

As evidências apresentadas permitem registrar o estado atual da interface antes das alterações previstas no trabalho, servindo como diagnóstico da versão original do sistema.

Esta avaliação corresponde à análise da versão atual do sistema e não contempla, nesta etapa, as alterações que serão realizadas posteriormente no redesign.
