# Relatório de Refatorações — Whiskerworld

## 1. Introdução

Este relatório apresenta as refatorações realizadas no sistema Whiskerworld, com o objetivo de melhorar a legibilidade, a organização e a manutenibilidade do código-fonte, preservando seu comportamento observável. O trabalho envolveu a identificação de *code smells*, a aplicação de quatro técnicas de refatoração e a realização de testes de caracterização para verificar se as alterações mantiveram os resultados esperados.

As atividades foram distribuídas entre os integrantes da equipe e contemplaram refatorações planejadas, oportunistas e pares de transformações inversas.

## 2. Resumo das refatorações realizadas

### 2.1 Extração de Método (*Extract Method*)

A técnica foi aplicada para dividir métodos extensos em funções menores, com responsabilidades mais específicas, e reduzir a duplicação de código.

Entre as principais alterações estão:

- `calcularCompatibilidade`: redução de 97 para 22 linhas, por meio da divisão da lógica em métodos auxiliares.
- `registrarUsuario`: redução de 81 para 30 linhas, facilitando a compreensão das etapas do registro.
- `normalizarTipoUsuario`: extração de uma lógica de normalização duplicada.
- Par neutro: extração do método `validarDescricao`, seguida de *Inline Method*, retornando à estrutura anterior.

As alterações envolveram principalmente os arquivos `compatibilidadeService.js`, `usuariosService.js` e `acompanhamentosService.js`.

### 2.2 Extração de Variável (*Extract Variable*)

Essa técnica foi utilizada para atribuir nomes significativos a expressões e valores, facilitando a compreensão das regras de negócio e das condições utilizadas no código.

Entre os exemplos documentados estão:

- `temPermissao`: explicita uma condição relacionada à autorização de acesso.
- `temImpedimento`: identifica uma condição usada no cálculo de compatibilidade.
- `tamanhoMaximoFoto`: nomeia o limite de tamanho permitido para o envio de fotografias.
- `ehDomingo`: torna explícita uma expressão relacionada ao dia da semana.

As alterações envolveram serviços de acompanhamentos, compatibilidade, fotografias e agendamentos. Como par neutro, a variável `ehDomingo` foi extraída e posteriormente incorporada novamente ao código por meio de *Inline Variable*.

### 2.3 Consolidação de Expressão Condicional (*Consolidate Conditional Expression*)

A técnica foi empregada para tornar condições complexas mais compreensíveis, agrupando verificações em funções cujos nomes expressam suas finalidades.

Entre as funções documentadas estão:

- `respostasInvalidas`, no serviço de compatibilidade;
- `faltamDadosDoAgendamento`, no serviço de agendamentos;
- `cabecalhoAutenticacaoInvalido` e `usuarioNaoEhAdministrador`, no middleware de autenticação;
- `identificadorAdocaoInvalido` e `acessoAoAcompanhamentoNegado`, no serviço de acompanhamentos.

Também foi planejada a condição `registroEstaBloqueado`, no componente `AcompanhamentoPage.jsx`, cuja aplicação deve ser confirmada na versão integrada.

As alterações buscaram melhorar a leitura das regras de validação, autenticação e autorização, mantendo a lógica original das condições.

### 2.4 Renomeação de Variável (*Rename Variable*)

A Renomeação de Variável foi aplicada para substituir identificadores genéricos ou pouco informativos por nomes que representam melhor os dados armazenados. Essa técnica tratou o *code smell* conhecido como **Nome Misterioso**, sem alterar interfaces públicas, rotas ou respostas da API.

Os principais exemplos foram:

- `count` para `quantidadeRemovida`, nos serviços de favoritos e animais;
- `body` para `dadosNovoAnimal` e `dadosAtualizacao`, no serviço de animais;
- `err` para `erro`, no tratamento de erros do controlador de usuários;
- `result` para `resultado` e `atual` para `animalAtual`, em refatorações oportunistas.

Também foi documentado um par neutro, no qual `quantidadeRemovida` foi renomeada para `totalRemovido` e, posteriormente, renomeada de volta.

A documentação registra testes de caracterização executados antes e depois das alterações, com 60 de 60 testes aprovados em cada versão.

## 3. Justificativas para as escolhas

As técnicas foram selecionadas a partir de problemas identificados no código-fonte, como métodos extensos, expressões condicionais complexas, nomes pouco informativos, valores sem identificação clara e trechos duplicados.

A Extração de Método favorece a separação de responsabilidades e a reutilização de código. A Extração de Variável torna expressões mais fáceis de interpretar. A Consolidação de Expressão Condicional explicita o propósito das regras de negócio. A Renomeação de Variável melhora a clareza dos identificadores e facilita a manutenção.

As refatorações planejadas foram realizadas com base em problemas previamente identificados, enquanto as oportunistas aproveitaram oportunidades encontradas durante o desenvolvimento e a escrita dos testes. Os pares neutros demonstram transformações que se anulam, permitindo observar que a aplicação seguida da reversão pode preservar a estrutura original do código.

## 4. Validação e preservação do comportamento

A equipe utilizou testes de caracterização, comparações de resultados e evidências de código antes e depois das alterações para verificar a preservação do comportamento.

Na Extração de Método, a documentação registra 29 testes aprovados antes e depois das alterações, além de resultados idênticos para 17.496 combinações de respostas utilizadas na avaliação de `calcularCompatibilidade`.

Na Extração de Variável, foram registrados 36 testes aprovados antes e depois, além da comparação dos resultados do cálculo de compatibilidade.

Na Renomeação de Variável, foram executados 60 testes antes e 60 depois das modificações, todos aprovados em cada versão.

Na Consolidação de Expressão Condicional, a documentação apresenta resultados de testes e comparações de equivalência obtidos em uma cópia de trabalho. Entretanto, registra a necessidade de validar as alterações na versão integrada. Assim, a confirmação final dessa técnica depende da execução dos testes após a integração.

## 5. Links para o código e as evidências

- **[Extração de Método](https://github.com/llilibet/whiskerworld/tree/main/docs/tp5-refatoracao/extracao-de-metodo)** — documentação das refatorações, exemplos de código antes e depois e evidências dos testes.
- **[Extração de Variável](https://github.com/llilibet/whiskerworld/tree/main/docs/tp5-refatoracao/extracao-de-variavel)** — justificativas, alterações realizadas e evidências de validação.
- **[Renomeação de Variável](https://github.com/llilibet/whiskerworld/tree/main/docs/tp5-refatoracao/renomear-variavel)** — documentação das renomeações, diffs e resultados dos testes antes e depois.
- **[Consolidação de Expressão Condicional](https://github.com/llilibet/whiskerworld/tree/main/docs/tp5-refatoracao/consolidar-expressao-condicional)** — relatório, demonstração de equivalência e evidências das condições refatoradas.

As documentações individuais reúnem os arquivos afetados, os exemplos de código antes e depois e as evidências utilizadas para avaliar a preservação do comportamento do sistema.

## 6. Aprendizados e dificuldades

A atividade permitiu compreender que refatorar não significa necessariamente adicionar funcionalidades, mas melhorar a estrutura interna do software sem alterar seu comportamento observável. A identificação de *code smells* ajudou a reconhecer problemas de legibilidade e organização que poderiam dificultar futuras modificações.

Outro aprendizado foi a importância dos testes de caracterização para comparar o comportamento antes e depois das alterações. Os pares neutros também contribuíram para demonstrar como determinadas transformações podem ser revertidas sem deixar mudanças no código final.

Entre as dificuldades, destaca-se a coordenação das alterações realizadas por diferentes integrantes, principalmente quando mais de uma técnica afetava arquivos compartilhados. A integração exige atenção aos conflitos, à compatibilidade entre modificações e à execução dos testes na versão final do projeto.

## 7. Considerações finais

As quatro técnicas aplicadas contribuíram para tornar o código do Whiskerworld mais legível, organizado e fácil de manter. A combinação de intervenções planejadas, oportunistas e pares neutros permitiu abordar diferentes problemas estruturais e documentar evidências da preservação do comportamento.

Para concluir a validação do trabalho, é necessário confirmar a integração de todas as contribuições e executar os testes na versão final do repositório, especialmente nos trechos cuja documentação ainda indica validação pendente.
