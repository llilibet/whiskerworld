# Refatorações Planejadas

As aplicações da técnica **Renomear Variável** no backend foram refatorações planejadas. 

Ao analisar o código em busca de problemas de legibilidade, identificamos antecipadamente que variáveis de retorno de banco de dados e objetos de requisição estavam utilizando nomes muito genéricos (S1 e S2). 

Planejamos as substituições (como `count` para `quantidadeRemovida` e `body` para `dadosNovoAnimal`) visando tornar a leitura do código mais natural e próxima da linguagem do negócio (Ubiquitous Language). A mudança exigiu apenas a alteração do identificador local. As chamadas aos repositórios e as condições de verificação permaneceram estruturalmente iguais, o que garante que o comportamento observável do sistema não foi alterado.
