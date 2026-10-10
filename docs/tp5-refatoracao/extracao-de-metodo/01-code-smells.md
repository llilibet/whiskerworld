# 1. Code smells identificados

*Code smells* são sinais no código de que o design pode ser melhorado. Eles não são bugs: o sistema funciona, mas fica mais difícil de entender, testar e alterar. O capítulo 9 de *Engenharia de Software Moderna* apresenta um catálogo desses sinais e as refatorações que costumam resolvê-los.

Analisamos os serviços do backend (`backend/src/services`), onde ficam as regras de negócio, e encontramos os casos abaixo. Todos eles podem ser tratados com **Extração de Método**.

| # | Smell | Onde | Situação |
|---|---|---|---|
| S1 | Método Longo | `compatibilidadeService.calcularCompatibilidade` | Resolvido por R1 |
| S2 | Método Longo | `usuariosService.registrarUsuario` | Resolvido por R2 |
| S3 | Comentários que explicam blocos | `usuariosService.registrarUsuario` | Resolvido por R2 |
| S4 | Código Duplicado | regra do tipo padrão de usuário | Mitigado por R3 |
| S5 | Código Duplicado | verificação de permissão em `animaisService` | Identificado, não tratado |

---

## S1 — Método Longo em `calcularCompatibilidade`

**Onde:** `backend/src/services/compatibilidadeService.js`, 97 linhas antes da refatoração.

**Por que é um smell:** o método fazia cinco coisas diferentes, uma depois da outra:

1. validava se as respostas do questionário foram enviadas e se cada uma é permitida;
2. somava a pontuação;
3. verificava se havia algum impedimento (resposta "não" em campo essencial);
4. classificava o resultado em Alta, Média ou Baixa;
5. montava a lista de orientações para o adotante, com dez `if` seguidos.

Para entender só a regra de classificação, era preciso ler o método inteiro. Para alterar uma orientação, era preciso navegar por validações e cálculos que não têm relação com ela. As etapas também não podiam ser testadas nem reutilizadas de forma isolada.

**Como foi resolvido:** cada etapa virou um método com nome próprio. O método principal ficou com 22 linhas e passou a ser lido como um resumo do algoritmo. Detalhes em [02-refatoracoes-planejadas.md](02-refatoracoes-planejadas.md#r1--calcularcompatibilidade).

---

## S2 — Método Longo em `registrarUsuario`

**Onde:** `backend/src/services/usuariosService.js`, 81 linhas antes da refatoração.

**Por que é um smell:** o cadastro de usuário misturava quatro responsabilidades:

1. validar e normalizar os dados do formulário;
2. verificar se o e-mail já existe no Firestore e no Firebase Auth;
3. criar a conta e gravar o documento com os dados de consentimento (LGPD);
4. traduzir os códigos de erro do Firebase para mensagens em português.

O método tinha dois blocos `try/catch` com papéis diferentes, o que dificultava saber qual erro era tratado em qual lugar.

**Como foi resolvido:** as quatro responsabilidades viraram os métodos `validarDadosCadastro`, `garantirEmailDisponivel`, `salvarDocumentoUsuario` e `traduzirErroCriacaoConta`. O método principal ficou com 30 linhas. Detalhes em [02-refatoracoes-planejadas.md](02-refatoracoes-planejadas.md#r2--registrarusuario).

---

## S3 — Comentários que explicam blocos de código

**Onde:** `registrarUsuario`, antes da refatoração:

```js
// Verifica se o e-mail já existe no Firestore
const existente = await usuariosRepository.findByEmail(email);
...
// Verifica se o e-mail já existe no Firebase Auth
try {
  await admin.auth().getUserByEmail(email);
...
// Documento no Firestore com UID como ID
const consentimentoEm = new Date().toISOString();
await db.collection('usuarios').doc(userRecord.uid).set({ ... });
```

**Por que é um smell:** Fowler chama esses comentários de "desodorante". Quando um bloco precisa de um comentário para dizer **o que** faz, isso indica que ele deveria ser um método cujo nome diga isso. Além disso, comentários não são verificados pelo compilador nem pelos testes, e ficam desatualizados com facilidade.

**Como foi resolvido:** os blocos viraram `garantirEmailDisponivel(email)` e `salvarDocumentoUsuario(uid, ...)`, e os comentários de "o que faz" foram removidos. Mantivemos apenas os comentários que explicam **por quê**, como `// Claims ficam embutidas no ID token — sem precisar de lookup no Firestore`, porque essa informação não cabe em um nome de método.

---

## S4 — Código Duplicado: tipo padrão do usuário

**Onde:** a regra "se o tipo não for informado, o usuário é ADOTANTE, e o tipo é sempre gravado em maiúsculas" aparecia três vezes:

```text
backend/src/services/usuariosService.js     (registrarUsuario)   const tipo = (tipo || 'ADOTANTE').toUpperCase();
backend/src/services/usuariosService.js     (syncGoogleUsuario)  const tipoFinal = (tipo || 'ADOTANTE').toUpperCase();
backend/src/controllers/usuariosController.js                    const tipo = (req.body?.tipo || 'ADOTANTE').toUpperCase();
```

**Por que é um smell:** se a regra mudar, por exemplo com um novo tipo padrão ou a validação de tipos permitidos, cada cópia precisa ser alterada. Se alguém esquecer uma, o cadastro por e-mail e o cadastro pelo Google passam a se comportar de forma diferente.

**Como foi mitigado:** as duas ocorrências do serviço foram substituídas por `normalizarTipoUsuario(tipo)` (R3). A cópia do controller continua lá: o controller já normaliza o valor antes de chamar o serviço, então tirá-la não muda o resultado, mas exigiria exportar um auxiliar interno do serviço apenas para isso. Deixamos registrada como próximo passo. Detalhes em [03-refatoracao-oportunista.md](03-refatoracao-oportunista.md).

---

## S5 — Código Duplicado: verificação de permissão em `animaisService` (não tratado)

**Onde:** `backend/src/services/animaisService.js`, em `atualizarAnimal` e `deletarAnimal`:

```js
const atual = await animaisRepository.findById(id);
if (!atual) {
  throw new AppError('Animal não encontrado.', 404);
}
if (atual.cadastradoPor && atual.cadastradoPor !== adminId) {
  throw new AppError('Você não tem permissão para editar este animal.', 403);
}
```

O mesmo bloco aparece em `deletarAnimal`, mudando apenas o nome da variável (`animal`) e a palavra "editar" para "remover".

**Por que é um smell:** a regra de "só o administrador que cadastrou pode alterar o animal" está escrita duas vezes. Uma mudança nessa regra exige alterar os dois lugares.

**Situação:** o caso foi identificado, mas ficou fora desta entrega, porque essa parte do código não estava sendo modificada e não tem testes para essas duas funções. Uma solução seria extrair `buscarAnimalDoAdmin(id, adminId, acao)`.
