# Documentação — Estratégia 2

## Mudança de regulamentação/política

## 1. Exclusão de conta

### Objetivo

Permitir que o usuário autenticado solicite a exclusão da própria conta, removendo também os dados diretamente relacionados ao uso da plataforma.

### Fluxo implementado

1. O usuário acessa a dashboard do adotante.
2. Seleciona **Excluir minha conta**.
3. O sistema abre um modal de confirmação com os impactos da operação.
4. O usuário escolhe entre manter a conta ou confirmar a exclusão.
5. O backend remove os favoritos, os agendamentos e o documento do usuário.
6. A conta é removida do Firebase Authentication.
7. A sessão local é encerrada e o usuário retorna à página inicial.

### Trecho da interface

Arquivo: `client/src/pages/AdotanteDashboardPage.jsx`

```jsx
const [exclusaoAberta, setExclusaoAberta] = useState(false);
const [excluindoConta, setExcluindoConta] = useState(false);

const handleExcluirConta = async () => {
  setExcluindoConta(true);
  try {
    await usuariosService.excluir();
    navigate('/');
  } catch (e) {
    alert(e.message);
    setExcluindoConta(false);
  }
};
```

```jsx
<button
  className="btn btn--outline-red"
  onClick={() => setExclusaoAberta(true)}
>
  Excluir minha conta
</button>

{exclusaoAberta && (
  <section
    className="account-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="account-modal-title"
  >
    <div className="account-modal__icon">!</div>
    <p className="account-modal__eyebrow">Atenção</p>
    <h2 id="account-modal-title">Excluir sua conta?</h2>
    <p>
      Essa decisão é permanente. Ao confirmar, sua conta será encerrada
      e os dados associados serão removidos.
    </p>
    <p>
      <strong>O que será removido:</strong> seus favoritos,
      agendamentos e dados de acesso.
    </p>
    <button onClick={() => setExclusaoAberta(false)}>
      Manter minha conta
    </button>
    <button onClick={handleExcluirConta} disabled={excluindoConta}>
      {excluindoConta ? 'Excluindo...' : 'Sim, excluir conta'}
    </button>
  </section>
)}
```

### Trecho da rota e controller

Arquivos: `backend/src/routes/usuarios.js` e `backend/src/controllers/usuariosController.js`

```js
router.delete('/me', autenticarToken, usuariosController.excluirUsuario);
```

```js
async function excluirUsuario(req, res) {
  try {
    await usuariosService.excluirUsuario(req.usuario?.id);
    return res.json({ mensagem: 'Conta excluída com sucesso.' });
  } catch (err) {
    return handleError(res, err);
  }
}
```

### Trecho do service

Arquivo: `backend/src/services/usuariosService.js`

```js
async function excluirUsuario(uid) {
  if (!uid) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  await Promise.all([
    favoritosRepository.removeByUsuario(uid),
    agendamentosRepository.removeByUsuario(uid),
    usuariosRepository.remove(uid),
  ]);

  try {
    await admin.auth().deleteUser(uid);
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err;
  }
}
```

### Tratamento dos dados relacionados

A exclusão usa o UID autenticado para localizar somente os documentos pertencentes ao usuário:

```js
async function removeByUsuario(usuarioId) {
  const snap = await col.where('usuario_id', '==', usuarioId).get();
  if (snap.empty) return 0;

  await Promise.all(snap.docs.map(doc => doc.ref.delete()));
  return snap.size;
}
```

Esse método é utilizado nas coleções `favoritos` e `agendamentos`. Animais cadastrados por administradores não são removidos por essa operação.

### Documentação legal simulada

#### Solicitação de exclusão

O usuário poderá solicitar a exclusão da sua conta a qualquer momento pela área autenticada da plataforma. Após a confirmação, o sistema removerá a conta de autenticação e os dados diretamente relacionados ao usuário.

A exclusão é uma operação permanente. Dados necessários para segurança, auditoria ou cumprimento de obrigações legais poderão exigir tratamento específico, caso aplicável ao contexto real do sistema.

## 2. Termos de Uso e Política de Privacidade

### Objetivo

Apresentar os documentos ao usuário antes do aceite e impedir a conclusão do cadastro quando os aceites obrigatórios não forem realizados.

### Fluxo implementado

1. O usuário preenche os dados do cadastro.
2. Clica em **Termos de Uso** ou **Política de Privacidade**.
3. O sistema abre um modal com o conteúdo do documento escolhido.
4. O usuário lê o documento e retorna ao cadastro.
5. Marca os dois checkboxes de aceite.
6. O cadastro é enviado ao backend.
7. O backend valida novamente os dois aceites.
8. O cadastro é bloqueado se qualquer aceite estiver ausente.

### Trecho da interface

Arquivo: `client/src/pages/CadastroPage.jsx`

```jsx
const [form, setForm] = useState({
  nome: '',
  email: '',
  senha: '',
  aceitouTermos: false,
  aceitouPrivacidade: false,
});

const [documentoAberto, setDocumentoAberto] = useState(null);
```

```jsx
<label className="form-label">
  <input
    type="checkbox"
    name="aceitouTermos"
    checked={form.aceitouTermos}
    onChange={(e) => setForm({
      ...form,
      aceitouTermos: e.target.checked,
    })}
    required
  />
  Aceito os{' '}
  <button
    type="button"
    className="document-link"
    onClick={() => setDocumentoAberto('termos')}
  >
    Termos de Uso
  </button>.
</label>
```

```jsx
<label className="form-label">
  <input
    type="checkbox"
    name="aceitouPrivacidade"
    checked={form.aceitouPrivacidade}
    onChange={(e) => setForm({
      ...form,
      aceitouPrivacidade: e.target.checked,
    })}
    required
  />
  Aceito a{' '}
  <button
    type="button"
    className="document-link"
    onClick={() => setDocumentoAberto('privacidade')}
  >
    Política de Privacidade
  </button>.
</label>
```

### Trecho da validação no backend

Arquivo: `backend/src/services/usuariosService.js`

```js
async function registrarUsuario({
  nome,
  email,
  senha,
  tipo,
  aceitouTermos,
  aceitouPrivacidade,
}) {
  if (!nome || !email || !senha) {
    throw new AppError(
      'Nome, email e senha são obrigatórios.',
      400,
    );
  }

  if (aceitouTermos !== true || aceitouPrivacidade !== true) {
    throw new AppError(
      'É necessário aceitar os Termos de Uso e a Política de Privacidade.',
      400,
    );
  }

  // Continuação do cadastro...
}
```

### Registro do consentimento

```js
const consentimentoEm = new Date().toISOString();

await db.collection('usuarios').doc(userRecord.uid).set({
  nome,
  email,
  tipo,
  termosAceitos: true,
  termosAceitosEm: consentimentoEm,
  versaoTermos: '1.0',
  privacidadeAceita: true,
  privacidadeAceitaEm: consentimentoEm,
  versaoPrivacidade: '1.0',
});
```

O sistema registra que os documentos foram aceitos, o momento do aceite e a versão apresentada ao usuário.

### Termos de Uso simulados

Ao utilizar o Whiskerworld, o usuário concorda em fornecer informações verdadeiras e em utilizar a plataforma de forma responsável.

A plataforma tem como finalidade conectar pessoas interessadas em adoção a animais cadastrados. O sistema não garante a conclusão de uma adoção ou de um agendamento.

O usuário é responsável pelas informações fornecidas e pela proteção dos seus dados de acesso. O uso indevido da plataforma poderá resultar no bloqueio da conta.

Os termos poderão ser atualizados para refletir mudanças no sistema ou na atividade acadêmica. Em uma aplicação real, alterações relevantes deverão ser comunicadas aos usuários conforme a legislação aplicável.

### Política de Privacidade simulada

O sistema coleta dados informados no cadastro, como nome e e-mail, para criar e administrar a conta do usuário.

Também são tratados dados relacionados ao uso da plataforma, como favoritos e agendamentos, para disponibilizar esses recursos.

Os dados são utilizados para o funcionamento do sistema e para a execução das funcionalidades solicitadas pelo usuário. Esta documentação não define uma política jurídica completa nem substitui uma análise especializada.

O usuário poderá solicitar a exclusão da conta pela área autenticada. Esta implementação possui finalidade acadêmica e não representa certificação de conformidade jurídica com a LGPD.

## 3. Arquivos modificados e responsabilidade

### Backend

| Arquivo | Responsabilidade na adaptação |
| --- | --- |
| `backend/src/routes/usuarios.js` | Expõe a rota autenticada `DELETE /usuarios/me`. |
| `backend/src/controllers/usuariosController.js` | Recebe a solicitação, chama o service e devolve a resposta HTTP. |
| `backend/src/services/usuariosService.js` | Valida os aceites, registra o consentimento e coordena a exclusão da conta. |
| `backend/src/repositories/usuariosRepository.js` | Remove o documento do usuário na coleção `usuarios`. |
| `backend/src/repositories/favoritosRepository.js` | Remove os favoritos filtrados pelo `usuario_id`. |
| `backend/src/repositories/agendamentosRepository.js` | Remove os agendamentos filtrados pelo `usuario_id`. |

### Frontend

| Arquivo | Responsabilidade na adaptação |
| --- | --- |
| `client/src/pages/CadastroPage.jsx` | Apresenta os links, os modais dos documentos e os checkboxes obrigatórios. |
| `client/src/pages/AdotanteDashboardPage.jsx` | Apresenta o modal de confirmação e inicia a exclusão da conta. |
| `client/src/services/usuariosService.js` | Envia a requisição autenticada e encerra a sessão após a exclusão. |
| `client/src/styles/global.css` | Define os estilos dos modais, links dos documentos e estados visuais da confirmação. |

### Responsabilidade por camada

```text
Interface React
  CadastroPage.jsx ----------------------> leitura e aceite dos documentos
  AdotanteDashboardPage.jsx  ------------> confirmação da exclusão
                  |
                  v
Serviço do frontend
  usuariosService.js --------------------> chamada HTTP autenticada
                  |
                  v
API Express
  usuarios.js -> usuariosController.js --> validação e resposta HTTP
                  |
                  v
Serviço do backend
  usuariosService.js --------------------> regra de negócio e Firebase Auth
                  |
                  v
Repositórios Firestore
  usuariosRepository.js -----------------> documento do usuário
  favoritosRepository.js ----------------> favoritos do usuário
  agendamentosRepository.js -------------> agendamentos do usuário
```

## 4. Testes, comandos e resultados

Os comandos abaixo foram executados na branch `estrategia-2-lgpd`.

### Verificação de sintaxe do backend

Executado a partir da raiz do projeto:

```bash
node --check backend/src/services/usuariosService.js
node --check backend/src/controllers/usuariosController.js
node --check backend/src/routes/usuarios.js
node --check backend/src/repositories/usuariosRepository.js
node --check backend/src/repositories/agendamentosRepository.js
node --check backend/src/repositories/favoritosRepository.js
```

Resultado: todos os arquivos foram aceitos pelo Node.js sem erro de sintaxe.

### Testes automatizados do backend

Executado na pasta `backend`:

```bash
npm test -- --runInBand
```

Resultado registrado:

```text
tests 9
pass 9
fail 0
```

### Testes automatizados do frontend

Executado na pasta `client`:

```bash
npm test -- --run
```

Resultado registrado:

```text
Test Files 1 passed
Tests 1 passed
```

### Build de produção do frontend

Executado na pasta `client`:

```bash
npm run build
```

Resultado: o Vite transformou os módulos e concluiu o build sem erros. A pasta `client/dist` foi removida depois da validação por ser um artefato gerado.

### Verificação do diff

Executado na raiz do projeto:

```bash
git diff --check
git status --short --branch
```

Resultado: não foram identificados erros de whitespace. As alterações ficaram na branch `estrategia-2-lgpd`.

## 5. Roteiro das evidências visuais

- `01-cadastro-antes.mp4`: cadastro sem os documentos e sem os checkboxes.
- `02-cadastro-com-termos.mp4`: abertura dos Termos de Uso e da Política de Privacidade.
- `03-perfil-sem-exclusão-de-conta.mp4`: abertura do perfil sem o campo de exclusão de conta.
- `04-resultado-exclusão-de-conta.mp4`: retorno à página inicial após a exclusão.

## 6. Resumo das validações

- Testes do backend: 9 testes aprovados.
- Testes do frontend: 1 teste aprovado.
- Build do frontend: concluído com sucesso.
- Validação de sintaxe dos arquivos backend: concluída.
