# Identificação de Code Smells

## Problema identificado: Nomes Misteriosos (Mysterious Name)

No arquivo `backend/src/services/favoritosService.js`, na função `removerFavorito`, identificamos o code smell conhecido como **Nomes Misteriosos** (ou *Mysterious Name*). 

A variável `count` possuía um nome genérico, que não explicava claramente o que estava sendo contado. No contexto da função, o valor retornado pelo repositório representa a quantidade de registros de favoritos removidos.

A técnica **Renomear Variável** foi aplicada para alterar o nome de `count` para `quantidadeRemovida`, tornando a intenção do código mais explícita, resolvendo o code smell e facilitando a compreensão e manutenção do sistema.