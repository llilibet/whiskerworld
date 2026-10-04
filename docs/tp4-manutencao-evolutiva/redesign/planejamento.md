# Planejamento do Redesign — Whiskerworld

## 1. Objetivo

Este documento apresenta o planejamento das melhorias de interface do sistema **Whiskerworld**, elaborado a partir dos problemas identificados durante a avaliação heurística da versão atual do sistema.

O objetivo do redesign é corrigir os problemas de usabilidade identificados, tornando a interface mais clara, consistente e eficiente para os usuários. As alterações propostas foram definidas considerando a gravidade dos problemas encontrados e sua relação com as Heurísticas de Usabilidade de Nielsen.

O planejamento não contempla a implementação das alterações, mas estabelece quais melhorias deverão ser realizadas e quais aspectos da interface deverão ser modificados durante a etapa de implementação.

---

## 2. Estratégia de Redesign

As melhorias serão planejadas a partir dos problemas identificados na avaliação heurística, priorizando inicialmente aqueles classificados como **graves (gravidade 3)** e, posteriormente, os problemas classificados como **menores (gravidade 2)**.

As alterações serão direcionadas principalmente para:

- melhoria da navegação entre diferentes áreas do sistema;
- padronização dos elementos visuais;
- prevenção de ações acidentais;
- melhoria da clareza dos estados dos componentes;
- redução do esforço necessário para realizar determinadas tarefas;
- melhoria da compreensão das mensagens apresentadas pelo sistema;
- aumento da visibilidade de funcionalidades importantes.

Cada melhoria será relacionada ao problema identificado na avaliação heurística e à respectiva heurística de Nielsen.

---

## 3. Melhorias Planejadas

### P01 — Troca de perfil exige retorno à tela inicial

**Heurística relacionada:** H3 — Controle e liberdade do usuário

**Gravidade:** 2 — Menor

**Problema identificado:**

A troca de perfil atualmente exige que o usuário retorne à tela inicial para selecionar outra área do sistema.

**Melhoria planejada:**

Adicionar uma opção de troca de perfil diretamente nas áreas internas do sistema, permitindo que o usuário alterne entre os perfis disponíveis sem precisar retornar à tela inicial.

**Estratégia de implementação:**

- disponibilizar uma opção de troca de perfil nas áreas em que o usuário estiver autenticado;
- posicionar a opção em um local de fácil identificação, preferencialmente junto aos elementos relacionados à conta ou navegação;
- permitir que o usuário selecione outro perfil diretamente;
- evitar que a troca de perfil exija etapas desnecessárias.

**Objetivo da melhoria:**

Reduzir a quantidade de etapas necessárias para alternar entre diferentes contextos do sistema e aumentar o controle do usuário sobre sua navegação.

**Prioridade:** Média

---

### P02 — Diferença visual entre as opções de acesso aos perfis

**Heurística relacionada:** H4 — Consistência e padrões

**Gravidade:** 2 — Menor

**Problema identificado:**

As opções de acesso aos diferentes perfis apresentam diferenças visuais significativas, como cores e estilos distintos de botões.

**Melhoria planejada:**

Padronizar visualmente as opções de acesso aos perfis, mantendo uma estrutura visual consistente entre as alternativas disponíveis.

**Estratégia de implementação:**

- estabelecer um padrão visual para os botões de acesso aos perfis;
- utilizar componentes com estrutura, dimensões e estilos semelhantes;
- manter diferenças visuais apenas quando forem necessárias para identificar uma função ou perfil específico;
- garantir que as opções sejam percebidas como alternativas equivalentes de acesso.

**Objetivo da melhoria:**

Reduzir a inconsistência visual e facilitar a compreensão da relação entre as opções de acesso.

**Prioridade:** Média

---

### P03 — Campos obrigatórios sem indicação visual padronizada

**Heurística relacionada:** H4 — Consistência e padrões

**Gravidade:** 2 — Menor

**Problema identificado:**

Os formulários não apresentam uma indicação visual padronizada para informar quais campos são obrigatórios.

**Melhoria planejada:**

Adicionar uma identificação visual consistente para todos os campos obrigatórios dos formulários.

**Estratégia de implementação:**

- utilizar um padrão visual único para indicar campos obrigatórios;
- adicionar um indicador, como o símbolo `*`, aos campos que exigem preenchimento;
- manter o mesmo padrão nos diferentes formulários do sistema;
- quando necessário, incluir uma legenda explicando o significado do indicador.

**Objetivo da melhoria:**

Permitir que o usuário identifique previamente quais informações são necessárias, reduzindo dúvidas e erros durante o preenchimento.

**Prioridade:** Média

---

### P04 — Ação de exclusão da conta exposta no dashboard

**Heurística relacionada:** H5 — Prevenção de erros

**Gravidade:** 3 — Grave

**Problema identificado:**

A opção de exclusão da conta encontra-se disponível no dashboard junto às demais ações da conta, podendo facilitar o acionamento acidental de uma operação destrutiva.

**Melhoria planejada:**

Modificar a apresentação da opção de exclusão da conta, separando-a das ações comuns e adicionando uma etapa de confirmação antes da realização da operação.

**Estratégia de implementação:**

- separar visualmente a ação de exclusão das demais ações da conta;
- utilizar uma identificação visual que deixe clara a natureza destrutiva da ação;
- solicitar confirmação antes da exclusão definitiva;
- apresentar uma mensagem explicando que a ação poderá ser permanente;
- disponibilizar uma opção clara para cancelar a operação.

**Objetivo da melhoria:**

Reduzir a possibilidade de exclusões acidentais e garantir que o usuário tenha oportunidade de interromper a operação antes de sua execução.

**Prioridade:** Alta

---

### P05 — Estado pouco claro no preview de imagem do cadastro de animal

**Heurística relacionada:** H5 — Prevenção de erros

**Gravidade:** 2 — Menor

**Problema identificado:**

O espaço destinado à visualização da imagem durante o cadastro de um animal apresenta um estado inicial pouco claro quando não há uma imagem disponível.

**Melhoria planejada:**

Substituir o estado visual pouco informativo por um componente que indique claramente a finalidade do espaço e o estado atual da imagem.

**Estratégia de implementação:**

- apresentar uma mensagem ou indicação visual informando que uma imagem deve ser adicionada;
- diferenciar claramente o estado vazio do estado em que uma imagem foi carregada;
- fornecer uma indicação visual para a ação de selecionar ou adicionar uma imagem;
- manter um padrão visual consistente com os demais campos do formulário.

**Objetivo da melhoria:**

Facilitar a compreensão do estado do campo de imagem e reduzir dúvidas durante o cadastro de animais.

**Prioridade:** Média

---

### P06 — Navegação da listagem depende da seleção de espécie

**Heurística relacionada:** H7 — Flexibilidade e eficiência de uso

**Gravidade:** 2 — Menor

**Problema identificado:**

O acesso à listagem de animais depende inicialmente da seleção de uma espécie, como gatos ou cães, não apresentando uma alternativa evidente para visualizar todos os animais.

**Melhoria planejada:**

Adicionar uma alternativa para visualizar diretamente todos os animais disponíveis, mantendo também a possibilidade de filtrar a listagem por espécie.

**Estratégia de implementação:**

- disponibilizar uma opção de acesso à listagem geral;
- manter as opções de filtragem por espécie;
- permitir que o usuário escolha entre visualizar todos os animais ou uma espécie específica;
- evitar que a seleção de uma espécie seja obrigatória para iniciar a exploração dos animais.

**Objetivo da melhoria:**

Aumentar a flexibilidade da navegação e permitir que diferentes usuários escolham a forma mais conveniente de explorar os animais disponíveis.

**Prioridade:** Média

---

### P07 — Formulário de agendamento extenso e sem divisão em etapas

**Heurística relacionada:** H7 — Flexibilidade e eficiência de uso

**Gravidade:** 2 — Menor

**Problema identificado:**

O formulário de agendamento concentra diversos campos em uma única etapa, tornando o processo extenso e dificultando a percepção de progresso.

**Melhoria planejada:**

Reorganizar o formulário de agendamento em etapas menores e logicamente agrupadas.

**Estratégia de implementação:**

- dividir os campos do formulário em grupos relacionados;
- organizar o processo em etapas sequenciais;
- indicar visualmente em qual etapa o usuário está;
- permitir que o usuário avance e revise as informações antes da conclusão;
- apresentar uma etapa final de revisão antes do envio do agendamento, quando aplicável.

**Objetivo da melhoria:**

Reduzir a carga de interação e tornar o processo de agendamento mais organizado e compreensível.

**Prioridade:** Média

---

### P08 — Estado visual dos campos preenchidos pode gerar dúvida

**Heurística relacionada:** H8 — Estética e design minimalista

**Gravidade:** 2 — Menor

**Problema identificado:**

Os campos preenchidos apresentam diferenças visuais entre si, como variações de cor de fundo, sem uma indicação clara do significado dessas diferenças.

**Melhoria planejada:**

Padronizar a aparência visual dos campos de entrada, estabelecendo estados visuais consistentes para campos vazios, preenchidos, em foco e, quando necessário, com erro.

**Estratégia de implementação:**

- definir um padrão visual único para os campos;
- padronizar cores de fundo e bordas;
- diferenciar visualmente estados importantes, como foco e erro;
- manter o mesmo comportamento visual nos diferentes formulários;
- evitar diferenças visuais que não possuam significado funcional.

**Objetivo da melhoria:**

Reduzir a necessidade de interpretação do usuário e tornar o estado dos campos mais previsível.

**Prioridade:** Média

---

### P09 — Botão de favorito apresenta baixa visibilidade

**Heurística relacionada:** H8 — Estética e design minimalista

**Gravidade:** 2 — Menor

**Problema identificado:**

O botão utilizado para favoritar um animal apresenta baixa diferenciação visual em relação aos demais elementos da interface.

**Melhoria planejada:**

Aumentar a visibilidade do botão de favorito, tornando sua função mais facilmente identificável e mantendo uma apresentação consistente com os demais elementos interativos.

**Estratégia de implementação:**

- aumentar a diferenciação visual do botão;
- utilizar um ícone ou elemento visual facilmente reconhecível;
- garantir contraste suficiente entre o botão e o fundo;
- apresentar visualmente a diferença entre os estados de favorito e não favoritado;
- manter o componente consistente nas diferentes telas em que a funcionalidade estiver disponível.

**Objetivo da melhoria:**

Facilitar a identificação da funcionalidade de favoritos e deixar evidente que o elemento pode ser acionado.

**Prioridade:** Média

---

### P10 — Mensagem de erro técnica sem orientação para recuperação

**Heurística relacionada:** H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar erros

**Gravidade:** 3 — Grave

**Problema identificado:**

Em situações de erro, o sistema apresenta a mensagem **"Token inválido ou expirado."**, utilizando um termo técnico sem explicar ao usuário o que aconteceu ou como solucionar o problema.

**Melhoria planejada:**

Substituir a mensagem técnica por uma mensagem orientada ao usuário, explicando o problema de forma compreensível e indicando uma ação para recuperação.

**Estratégia de implementação:**

- substituir ou complementar a mensagem técnica por uma descrição em linguagem simples;
- explicar de forma breve o motivo pelo qual a operação não pôde ser concluída;
- indicar ao usuário qual ação deve ser realizada para continuar;
- disponibilizar uma ação de recuperação adequada ao contexto do erro;
- evitar apresentar termos técnicos desnecessários ao usuário final.

**Exemplo de abordagem planejada:**

> "Sua sessão expirou. Faça login novamente para continuar."

**Objetivo da melhoria:**

Permitir que o usuário compreenda o erro e saiba como recuperar o acesso ao sistema sem depender de conhecimentos técnicos.

**Prioridade:** Alta

---

## 4. Priorização das Melhorias

Considerando a gravidade atribuída aos problemas durante a avaliação heurística, as melhorias serão priorizadas da seguinte forma:

| Prioridade | Problemas | Justificativa |
|---|---|---|
| **Alta** | P04 e P10 | Problemas classificados como gravidade 3, com potencial de causar consequências significativas ou dificultar a recuperação do usuário. |
| **Média** | P01, P02, P03, P05, P06, P07, P08 e P09 | Problemas classificados como gravidade 2, que não impedem diretamente a utilização do sistema, mas podem gerar dúvidas, aumentar o esforço de interação ou reduzir a eficiência. |

Os problemas P04 e P10 deverão receber atenção prioritária por apresentarem maior impacto na experiência do usuário.

---

## 5. Ordem Planejada de Implementação

Para organizar a execução das alterações, as melhorias serão implementadas seguindo a seguinte ordem:

### Etapa 1 — Problemas de maior gravidade

1. **P04 — Ação de exclusão da conta**
2. **P10 — Mensagem de erro técnica**

Essas alterações serão priorizadas por estarem classificadas como problemas de gravidade 3.

### Etapa 2 — Navegação e eficiência

3. **P01 — Troca de perfil**
4. **P06 — Listagem de animais**
5. **P07 — Formulário de agendamento**

O objetivo dessa etapa é reduzir etapas desnecessárias e melhorar a eficiência dos principais fluxos de interação.

### Etapa 3 — Consistência da interface

6. **P02 — Opções de acesso aos perfis**
7. **P03 — Campos obrigatórios**
8. **P08 — Estados dos campos**

Essa etapa busca estabelecer padrões visuais mais consistentes entre os componentes da interface.

### Etapa 4 — Clareza e visibilidade dos componentes

9. **P05 — Preview de imagem**
10. **P09 — Botão de favorito**

Essas alterações terão como foco tornar elementos específicos da interface mais claros e perceptíveis.

---

## 6. Resultado Esperado

Ao final da implementação do redesign, espera-se que o Whiskerworld apresente uma interface mais consistente, previsível e eficiente, reduzindo os problemas identificados durante a avaliação heurística.

As principais melhorias esperadas são:

- maior controle do usuário sobre a navegação;
- redução de etapas desnecessárias;
- maior consistência visual entre componentes;
- melhor identificação de campos obrigatórios;
- redução do risco de ações destrutivas acidentais;
- maior clareza dos estados dos componentes;
- maior flexibilidade na exploração dos animais;
- redução da complexidade do formulário de agendamento;
- maior visibilidade da funcionalidade de favoritos;
- mensagens de erro mais compreensíveis e com orientação para recuperação.

A implementação das alterações deverá posteriormente ser acompanhada de evidências do estado anterior e posterior da interface, relacionando cada mudança à heurística de Nielsen correspondente.
