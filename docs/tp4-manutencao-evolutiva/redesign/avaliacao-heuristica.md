# Avaliação Heurística do Sistema Atual — Whiskerworld

## 1. Objetivo

Realizar uma avaliação heurística da interface atual do sistema **Whiskerworld**, utilizando as **10 Heurísticas de Usabilidade de Nielsen**, com o objetivo de identificar problemas de usabilidade presentes na versão atual do sistema antes da etapa de redesign.

A avaliação considera os principais fluxos de interação disponíveis ao usuário, como acesso ao sistema, cadastro, navegação, interação com animais, agendamento e gerenciamento da conta.

Os problemas encontrados foram registrados com evidências fotográficas e classificados de acordo com sua **gravidade**, permitindo estabelecer uma visão geral dos principais pontos de usabilidade existentes na interface atual.

> Esta etapa corresponde exclusivamente à **avaliação da interface atual**. As propostas de correção e as alterações de redesign serão apresentadas posteriormente, relacionando cada mudança às heurísticas correspondentes.

---

## 2. Metodologia

A avaliação foi realizada por meio da inspeção da interface atual do Whiskerworld, considerando seus principais fluxos e telas disponíveis.

Cada tela ou fluxo analisado foi comparado com as **10 Heurísticas de Usabilidade de Nielsen**:

1. Visibilidade do status do sistema;
2. Correspondência entre o sistema e o mundo real;
3. Controle e liberdade do usuário;
4. Consistência e padrões;
5. Prevenção de erros;
6. Reconhecimento em vez de memorização;
7. Flexibilidade e eficiência de uso;
8. Estética e design minimalista;
9. Ajudar os usuários a reconhecer, diagnosticar e recuperar erros;
10. Ajuda e documentação.

Para cada problema identificado foram registrados:

* heurística relacionada;
* descrição do problema;
* evidência fotográfica;
* impacto na experiência do usuário;
* classificação de gravidade.

Problemas semelhantes foram consolidados para evitar duplicidade entre as avaliações.

---

## 3. Critérios de Gravidade

A gravidade dos problemas foi classificada utilizando a seguinte escala:

| Gravidade | Classificação | Descrição                                                                                             |
| --------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| 1         | Cosmético     | Problema visual ou de apresentação com baixo impacto na utilização do sistema.                        |
| 2         | Menor         | Problema que pode causar confusão ou dificultar a interação, mas não impede a realização da tarefa.   |
| 3         | Grave         | Problema que pode causar erros, insegurança ou dificuldade significativa na realização de uma tarefa. |
| 4         | Crítico       | Problema que impede ou compromete seriamente a realização de uma tarefa importante.                   |

---

# 4. Problemas Identificados

## P01 — Troca de perfil exige retorno à tela inicial

**Heurística:** H3 — Controle e liberdade do usuário

**Gravidade:** 2 — Menor

**Descrição:**

Após entrar na área de um determinado perfil, como a área do adotante, a troca para outro perfil não é disponibilizada diretamente na tela atual. Para acessar outra área, o usuário precisa retornar à tela inicial e realizar novamente o processo de seleção.

Esse comportamento aumenta a quantidade de passos necessários para alternar entre os contextos disponíveis no sistema.

**Impacto:**

A ausência de uma alternativa direta de troca de perfil reduz o controle do usuário sobre a navegação e torna o processo menos eficiente.

**Evidência:**

`h02-login-perfil.png`

---

## P02 — Diferença visual entre as opções de acesso aos perfis

**Heurística:** H4 — Consistência e padrões

**Gravidade:** 2 — Menor

**Descrição:**

Na tela inicial, as opções de acesso aos diferentes perfis apresentam diferenças visuais significativas, como cores e estilos dos botões.

Embora as opções sejam distintas, a apresentação visual pode dificultar a percepção de que ambas representam alternativas equivalentes de acesso ao sistema.

**Impacto:**

A inconsistência visual pode gerar dúvida sobre a relação entre as opções e aumentar o esforço necessário para interpretar a interface.

**Evidência:**

`h01-home-botoes.png`

---

## P03 — Campos obrigatórios sem indicação visual padronizada

**Heurística:** H4 — Consistência e padrões

**Gravidade:** 2 — Menor

**Descrição:**

Nos formulários analisados, os campos obrigatórios não apresentam uma indicação visual padronizada, como um asterisco (`*`) ou uma identificação explícita de que determinado campo é obrigatório.

**Impacto:**

O usuário precisa descobrir quais campos são necessários durante o preenchimento ou após uma tentativa de envio, aumentando a possibilidade de dúvidas e erros no preenchimento.

**Evidência:**

`h07-campos-obrigatorios.png`

---

## P04 — Ação de exclusão da conta exposta no dashboard

**Heurística:** H5 — Prevenção de erros

**Gravidade:** 3 — Grave

**Descrição:**

A opção de **exclusão da conta** está disponível no dashboard junto às demais ações da conta.

Por se tratar de uma operação potencialmente destrutiva e de difícil reversão, sua apresentação junto às ações comuns merece atenção especial.

**Impacto:**

A posição da ação pode aumentar o risco de o usuário acioná-la por engano, especialmente quando está navegando ou procurando outras funcionalidades da conta.

**Evidência:**

`h04-dashboard-exclusao.png`

---

## P05 — Estado pouco claro no preview de imagem do cadastro de animal

**Heurística:** H5 — Prevenção de erros

**Gravidade:** 2 — Menor

**Descrição:**

Durante o cadastro de um animal, o espaço destinado à visualização da imagem apresenta um estado visual pouco claro quando uma imagem ainda não está disponível.

A representação exibida pode não deixar evidente para o usuário se o componente está aguardando uma imagem, se ocorreu algum problema no carregamento ou se aquele é simplesmente o estado inicial do campo.

**Impacto:**

A falta de clareza pode gerar dúvidas durante o preenchimento do cadastro e dificultar a compreensão do estado atual do campo de imagem.

**Evidência:**

`cadastro-animal-preview.JPEG`

---

## P06 — Navegação da listagem depende da seleção de espécie

**Heurística:** H7 — Flexibilidade e eficiência de uso

**Gravidade:** 2 — Menor

**Descrição:**

Para acessar a listagem de animais, o usuário precisa inicialmente selecionar uma espécie, como **Gatos** ou **Cães**.

A interface não apresenta diretamente uma alternativa evidente para visualizar todos os animais disponíveis sem realizar essa seleção inicial.

**Impacto:**

Essa dependência adiciona uma etapa à navegação e reduz a flexibilidade para usuários que desejam explorar os animais disponíveis de maneira geral.

**Evidência:**

`h05-listagem-especies.png`

---

## P07 — Formulário de agendamento extenso e sem divisão em etapas

**Heurística:** H7 — Flexibilidade e eficiência de uso

**Gravidade:** 2 — Menor

**Descrição:**

O processo de agendamento apresenta um formulário extenso concentrado em uma única etapa, contendo diversos campos que precisam ser preenchidos pelo usuário.

A ausência de uma divisão visual em etapas torna o processo mais longo e pode dificultar a percepção de progresso durante o preenchimento.

**Impacto:**

Formulários extensos aumentam a carga de interação e podem tornar a tarefa mais cansativa, principalmente para usuários que precisam revisar ou corrigir informações.

**Evidência:**

`formulario-agendamento.JPEG`

---

## P08 — Estado visual dos campos preenchidos pode gerar dúvida

**Heurística:** H8 — Estética e design minimalista

**Gravidade:** 2 — Menor

**Descrição:**

Na tela de cadastro, os campos preenchidos apresentam uma aparência visual diferente entre si. Alguns campos possuem fundo escuro enquanto outro campo apresenta fundo branco.

Essa diferença pode gerar dúvida sobre o estado dos campos e sobre o significado de suas diferentes aparências.

**Impacto:**

A inconsistência visual aumenta o esforço de interpretação da interface e pode fazer o usuário questionar se todos os campos foram preenchidos corretamente.

**Evidência:**

`h03-cadastro-inputs.png`

---

## P09 — Botão de favorito apresenta baixa visibilidade

**Heurística:** H8 — Estética e design minimalista

**Gravidade:** 2 — Menor

**Descrição:**

O botão utilizado para favoritar um animal apresenta aparência quase transparente na interface.

A baixa diferenciação visual faz com que o elemento interativo seja pouco perceptível em relação aos demais componentes da tela.

**Impacto:**

A baixa visibilidade pode dificultar que o usuário identifique a existência da funcionalidade de favoritos ou perceba que aquele elemento pode ser acionado.

**Evidência:**

`favorito-baixa-visibilidade.JPEG`

---

## P10 — Mensagem de erro técnica sem orientação para recuperação

**Heurística:** H9 — Ajudar os usuários a reconhecer, diagnosticar e recuperar erros

**Gravidade:** 3 — Grave

**Descrição:**

Durante uma situação de erro, o sistema apresenta a mensagem:

> **“Token inválido ou expirado.”**

A mensagem utiliza um termo técnico e não apresenta informações adicionais que expliquem ao usuário comum o que aconteceu ou quais passos devem ser realizados para solucionar o problema.

**Impacto:**

O usuário pode não compreender a causa do erro nem saber como recuperar a situação, ficando sem uma orientação clara para continuar a utilização do sistema.

**Evidência:**

`h08-erro-token.png`

---

# 5. Resumo dos Problemas

| ID  | Heurística | Problema                                                      | Gravidade |
| --- | ---------- | ------------------------------------------------------------- | --------: |
| P01 | H3         | Troca de perfil exige retorno à tela inicial                  |         2 |
| P02 | H4         | Diferença visual entre as opções de acesso aos perfis         |         2 |
| P03 | H4         | Campos obrigatórios sem indicação visual padronizada          |         2 |
| P04 | H5         | Ação de exclusão da conta exposta no dashboard                |         3 |
| P05 | H5         | Estado pouco claro no preview de imagem do cadastro de animal |         2 |
| P06 | H7         | Navegação da listagem depende da seleção de espécie           |         2 |
| P07 | H7         | Formulário de agendamento extenso e sem divisão em etapas     |         2 |
| P08 | H8         | Estado visual dos campos preenchidos pode gerar dúvida        |         2 |
| P09 | H8         | Botão de favorito apresenta baixa visibilidade                |         2 |
| P10 | H9         | Mensagem de erro técnica sem orientação para recuperação      |         3 |

### Distribuição por gravidade

* **Gravidade 2 — Menor:** 8 problemas
* **Gravidade 3 — Grave:** 2 problemas
* **Gravidade 1 — Cosmético:** 0 problemas
* **Gravidade 4 — Crítico:** 0 problemas

---

# 6. Heurísticas sem problemas significativos identificados

Durante a avaliação, algumas heurísticas não apresentaram problemas suficientemente relevantes para serem registrados como ocorrências no relatório.

### H1 — Visibilidade do status do sistema

Não foi identificado um problema significativo que justificasse o registro de uma ocorrência específica nessa heurística.

### H2 — Correspondência entre o sistema e o mundo real

Os principais elementos e termos utilizados na interface são compreensíveis e não foi identificado um problema significativo relacionado especificamente à utilização de linguagem incompatível com o contexto do usuário.

### H6 — Reconhecimento em vez de memorização

Não foi identificado um problema suficientemente significativo relacionado à necessidade de o usuário memorizar informações para utilizar as principais funcionalidades avaliadas.

### H10 — Ajuda e documentação

Não foi identificado um problema específico suficientemente significativo relacionado à ausência ou inadequação de ajuda ou documentação durante os fluxos analisados.

---

# 7. Evidências Fotográficas

As capturas utilizadas na avaliação heurística estão organizadas no diretório de evidências do redesign, conforme a estrutura do repositório:

```text
docs/
├── tp1-manutencao-corretiva/
├── tp2-manutencao-preventiva/
├── tp3-manutenção-adaptativa/
└── tp4-manutenção-evolutiva/
    └── redesign/
        └── evidencias/
```

### `h01-home-botoes.png`

Utilizada para evidenciar o **P02**, relacionado à diferença visual entre as opções de acesso aos perfis.

### `h02-login-perfil.png`

Utilizada para evidenciar o **P01**, relacionado à dificuldade de alternância entre perfis.

### `h03-cadastro-inputs.png`

Utilizada para evidenciar o **P08**, relacionado à apresentação visual dos campos preenchidos.

### `h04-dashboard-exclusao.png`

Utilizada para evidenciar o **P04**, relacionado à exposição da ação de exclusão da conta.

### `h05-listagem-especies.png`

Utilizada para evidenciar o **P06**, relacionado à necessidade de selecionar uma espécie antes de explorar a listagem.

### `h07-campos-obrigatorios.png`

Utilizada para evidenciar o **P03**, relacionado à ausência de indicação visual dos campos obrigatórios.

### `h08-erro-token.png`

Utilizada para evidenciar o **P10**, relacionado à mensagem técnica apresentada pelo sistema.

### `cadastro-animal-preview.JPEG`

Utilizada para evidenciar o **P05**, relacionado ao estado pouco claro do preview de imagem durante o cadastro de um animal.

### `formulario-agendamento.JPEG`

Utilizada para evidenciar o **P07**, relacionado à extensão do formulário de agendamento e à ausência de divisão em etapas.

### `favorito-baixa-visibilidade.JPEG`

Utilizada para evidenciar o **P09**, relacionado à baixa visibilidade do botão de favorito.


# 8. Organização das Evidências no Repositório

A documentação da avaliação heurística e suas respectivas evidências fotográficas estão organizadas dentro da estrutura do **TP4 — Manutenção Evolutiva**, especificamente na etapa de **Redesign**:

```text
docs/
├── tp1-manutencao-corretiva/
├── tp2-manutencao-preventiva/
├── tp3-manutenção-adaptativa/
└── tp4-manutencao-evolutiva/
    └── redesign/
        ├── evidencias/
        │   ├── .gitkeep
        │   ├── Favorito-baixa-visibilidade.jpeg
        │   ├── cadastro-animal-preview.jpeg
        │   ├── formulario-agendamento.jpeg
        │   ├── h01-home-botoes.png
        │   ├── h02-login-perfil.png
        │   ├── h03-cadastro-inputs.png
        │   ├── h04-dashboard-exclusao.png
        │   ├── h05-listagem-especies.png
        │   ├── h07-campos-obrigatorios.png
        │   └── h08-erro-token.png
        └── avaliacao-heuristica.md
```

A pasta `evidencias/` contém as capturas de tela utilizadas para comprovar os problemas identificados durante a avaliação heurística. O arquivo `avaliacao-heuristica.md` contém a documentação completa da avaliação.

# 9. Considerações Finais

A avaliação heurística identificou **10 problemas de usabilidade** na versão atual do Whiskerworld.

A maior parte dos problemas foi classificada como **gravidade 2**, representando dificuldades que não impedem diretamente a utilização do sistema, mas podem gerar dúvidas, aumentar o esforço de interação ou reduzir a eficiência da navegação.

Também foram identificados **2 problemas de gravidade 3**, relacionados à exposição da ação de exclusão da conta e à apresentação de uma mensagem de erro técnica sem orientação para recuperação.

Os resultados desta avaliação servem como diagnóstico da interface atual e como base para a próxima etapa do trabalho, na qual as alterações de redesign poderão ser relacionadas diretamente às heurísticas de Nielsen e aos problemas identificados.

Esta documentação concentra-se exclusivamente na **avaliação heurística da versão atual do sistema**, sem incluir o planejamento ou a implementação das correções.
