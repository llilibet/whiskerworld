# Refatoração: Consolidar Expressão Condicional

Parte da **TP5 – Refatoração** do Whiskerworld. Este diretório reúne o relatório, a demonstração e as evidências das alterações nas condições de validação e autorização.

**Branch da organização desta entrega:** `refatoracao-consolidar-condicional`

**Tipo de manutenção:** Perfectiva.

## Objetivo

Melhorar a leitura das regras condicionais por meio de funções pequenas com nomes que expliquem sua intenção, preservando os critérios e a ordem de avaliação das expressões.

Nos quatro casos documentados, as condições já estavam agrupadas com operadores lógicos. A alteração realizada foi a extração dessas expressões para funções auxiliares nomeadas, etapa associada à técnica Consolidar Expressão Condicional.

## Problemas identificados

As condições escritas diretamente nos comandos `if` exigiam interpretar cada operador para compreender a regra aplicada.

Os nomes das funções auxiliares tornam explícitas as verificações de respostas inválidas, dados obrigatórios ausentes, cabeçalho de autenticação inválido e ausência do perfil de administrador.

## Navegação

| Documento ou pasta | Conteúdo |
|---|---|
| [01-relatorio-consolidar-condicionais.md](01-relatorio-consolidar-condicionais.md) | Relatório das alterações |
| [demonstracao/comparar-condicionais.js](demonstracao/comparar-condicionais.js) | Comparação das expressões originais com as funções auxiliares |
| [evidencias/prints/](evidencias/prints/) | Capturas do código antes e depois |
| [evidencias/texto/comparacao-condicionais.txt](evidencias/texto/comparacao-condicionais.txt) | Saída da execução da comparação |

## Resumo das alterações documentadas

| Caso | Arquivo | Função auxiliar |
|---|---|---|
| R1 — Validação das respostas | `backend/src/services/compatibilidadeService.js` | `respostasInvalidas` |
| R2 — Dados obrigatórios do agendamento | `backend/src/services/agendamentosService.js` | `faltamDadosDoAgendamento` |
| R3 — Cabeçalho de autenticação | `backend/src/middlewares/authMiddleware.js` | `cabecalhoAutenticacaoInvalido` |
| R4 — Perfil de administrador | `backend/src/middlewares/authMiddleware.js` | `usuarioNaoEhAdministrador` |

## Demonstração de equivalência

O script reproduz as expressões originais e as funções auxiliares, comparando seus resultados com `node:assert/strict`.

| Condição | Casos comparados | Resultado |
|---|---:|---|
| Respostas do questionário | 11 | Equivalentes |
| Dados obrigatórios do agendamento | 216 | Equivalentes |
| Cabeçalho de autenticação | 9 | Equivalentes |
| Perfil de administrador | 8 | Equivalentes |
| **Total** | **244** | **Todas as comparações passaram** |

Para executar a partir da raiz do projeto:

~~~bash
node docs/tp5-refatoracao/consolidar-expressao-condicional/demonstracao/comparar-condicionais.js
~~~

A comparação utiliza funções reproduzidas no script e um conjunto definido de entradas. Ela não importa os serviços reais, não cobre todas as entradas possíveis e não substitui os testes automatizados ou de integração do sistema.

## Evidências

As capturas em `evidencias/prints/` mostram os trechos de código antes e depois da refatoração.

O arquivo `evidencias/texto/comparacao-condicionais.txt` registra a saída real do script de demonstração.

Os prints de código não representam resultados de testes.

## Resultado

As quatro condições documentadas passaram a ser identificadas por nomes que descrevem suas regras. A comparação demonstrou resultados iguais nos 244 casos avaliados.

A alteração caracteriza manutenção perfectiva por melhorar a compreensão e a organização interna do código.