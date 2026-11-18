# Changelog

Todas as mudanças relevantes do Whiskerworld são registradas neste arquivo.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- **Acessibilidade (WCAG 2.1 A/AA)**, com 5 melhorias para leitores de tela, navegação por teclado e baixa visão. Justificativa e evidências em [`docs/tp4-manutencao-evolutiva/melhoria-acessibilidade.md`](docs/tp4-manutencao-evolutiva/melhoria-acessibilidade.md).
- Hook `useDialogAcessivel`: os modais recebem o foco ao abrir, mantêm o Tab dentro deles, fecham com Esc e devolvem o foco ao botão de origem.
- Testes automatizados de acessibilidade em `client/tests/acessibilidade.test.jsx`.
- **Pipeline de Entrega Contínua** com GitHub Actions e Vercel: CI em todo PR, smoke test no preview, deploy em produção com aprovação, smoke test depois do deploy e rollback automático. Proposta e configuração em [`docs/entrega-implantacao-continua/`](docs/entrega-implantacao-continua/README.md).
- Script `npm run smoke` para verificar o sistema publicado.
- Configuração do Firebase por variáveis de ambiente (`VITE_FIREBASE_*` e `FIREBASE_WEB_API_KEY`), com os valores de produção como padrão.

### Corrigido
- **Deploy na Vercel:** as rotas `/compatibilidade`, `/adocoes`, `/acompanhamentos`, `/docs` e `/api/health` não chegavam à API em produção; o build do frontend era procurado na pasta errada (`frontend-react` em vez de `dist`); e recarregar uma página do React Router dava erro 404.
- **Dependências:** vulnerabilidades críticas corrigidas com `npm audit fix`, incluindo a atualização do `multer` para 2.5.0. Com isso, uma foto de exatamente 2 MB passa a ser aceita no acompanhamento pós-adoção, igual à regra do serviço.
- **Rótulos dos campos:** 33 campos do login, do cadastro de adotante, do cadastro de animal e do agendamento não tinham rótulo associado. O leitor de tela anunciava só "caixa de texto" ou "lista de seleção", ou lia o placeholder.
- **Botões só com ícone:** os botões de excluir e editar animal, confirmar e cancelar agendamento, remover favorito e mostrar senha não tinham nome acessível, e o leitor anunciava o emoji ("🗑️", "✔", "✖", "✕", "👁️").
- **Contraste de cores:** 73 textos ficavam abaixo de 4,5:1. A cor de texto secundário foi de `#7A8C72` para `#5C6B55`, e também foram ajustados a barra de navegação, o menu da conta, o botão "Favoritado", o selo "DISPONÍVEL", o status "PENDENTE", os links de Termos e Política e o "ou" do login.
- **Foco visível:** o contorno de foco nos botões era quase invisível e foi substituído por um contorno azul de 3 px com `:focus-visible`.
- **Modais:** os modais de exclusão de conta e de Termos e Política não fechavam com Esc e deixavam o Tab percorrer a página atrás deles.

## Funcionalidades já existentes

Funcionalidades entregues antes da criação deste changelog, registradas a partir do histórico do repositório:

- Redesign baseado na avaliação heurística (heurísticas de Nielsen): troca de perfil, agendamento em etapas, zona de perigo para exclusão de conta, mensagens de erro claras, entre outras.
- Questionário de compatibilidade para adoção.
- Acompanhamento pós-adoção.
- Cadastro e autenticação de adotantes e administradores (e-mail/senha e Google).
- Listagem de animais por espécie, favoritos e agendamento de visitas.
- Painel administrativo para gestão de animais e agendamentos.
