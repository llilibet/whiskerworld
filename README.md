# Whiskerworld

Whiskerworld é um sistema web para aproximar adotantes, ONGs e administradores no processo de adocao de caes e gatos. A aplicacao permite visualizar pets disponiveis, cadastrar usuarios, autenticar adotantes e administradores, favoritar animais, solicitar/agendar visitas e gerenciar pets e agendamentos pela area administrativa.

## Requisitos Atendidos

- Compatibilidade com a documentacao: arquitetura em camadas com separacao entre frontend, controllers, services, repositories e banco firebase.
- API REST: endpoints `GET`, `POST`, `PUT` e `DELETE` para usuarios, animais, favoritos e agendamentos.
- Seguranca: senhas com `bcrypt`, autenticacao JWT e CORS configuravel por ambiente.
- Responsividade: frontend React/Vite com estilos responsivos para apresentacao em desktop e mobile.
- Separacao de responsabilidades: frontend em `client/`, backend Express em `backend/`.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 |
| Backend | Node.js + Express 5 |
| Banco de dados | Firebase Firestore |
| Armazenamento de fotos | Firebase Storage |
| Autenticação | Firebase Auth (e-mail/senha + Google) |

---

## 1. Conectar ao Firebase

### 1.1 Service Account (backend)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com/) → seu projeto
2. **Configurações do projeto (⚙️) → Contas de serviço → Gerar nova chave privada**
3. Salve o `.json` gerado (ex: `Downloads/whiskerworld-service-account.json`)
4. **Nunca suba esse arquivo para o repositório**

### 1.2 Credenciais do cliente (frontend)

1. **Configurações do projeto (⚙️) → Geral → Seus apps → Web (`</>`)**
2. Copie o objeto `firebaseConfig` e cole em `client/src/firebase.js` substituindo os valores existentes

---

## 2. Variáveis de ambiente

Crie um arquivo `.env` na **raiz do projeto** (ao lado de `package.json`):

```env
FIREBASE_SERVICE_ACCOUNT_PATH=C:/caminho/para/seu-arquivo-service-account.json
FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
```

> **Atenção:** use barras `/` no caminho, mesmo no Windows.

---

## 3. Instalar dependências

```bash
# Na raiz — instala dependências do backend
npm install

# Na pasta client — instala dependências do frontend
cd client
npm install
cd ..
```

Ou use o atalho:

```bash
npm run install:all
```

---

## 4. Inicializar o sistema

Abra **dois terminais** na raiz do projeto:

**Terminal 1 — Backend:**
```bash
npm start
```
O servidor inicia em `http://localhost:3000`

**Terminal 2 — Frontend (Vite):**
```bash
cd client
npm run dev
```
O frontend inicia em `http://localhost:5173`

Ou use o comando combinado (requer o terminal suportar `concurrently`):
```bash
npm run dev
```

### Acessar o sistema

| URL | Descrição |
|---|---|
| `http://localhost:5173` | Aplicação React (use este) |
| `http://localhost:3000/api/health` | Verificar se a API está no ar |

---

## 5. Estrutura do projeto

```
whiskerworld/
├── api/
│   └── index.js              # Entrada Vercel (deploy)
├── backend/
│   ├── server.js             # Servidor Express
│   └── src/
│       ├── controllers/      # Lógica das rotas
│       ├── database/
│       │   └── connection.js # Inicialização Firebase Admin
│       ├── middlewares/
│       │   ├── authMiddleware.js    # Verificação de token Firebase
│       │   └── uploadFotoAnimal.js  # Upload com Multer
│       ├── repositories/     # Acesso ao Firestore
│       ├── routes/           # Definição das rotas Express
│       └── services/         # Regras de negócio
├── client/                   # Frontend React + Vite
│   ├── src/
│   │   ├── components/       # Navbar, Footer, AnimalCard
│   │   ├── hooks/            # useAuth, useAnimais
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Camada de comunicação com a API
│   │   ├── firebase.js       # Configuração Firebase cliente
│   │   └── App.jsx           # Rotas React Router
│   └── vite.config.js        # Proxy Vite → backend :3000
├── .env                      # Variáveis de ambiente (não versionar)
├── package.json              # Scripts e dependências do backend
└── vercel.json               # Configuração de deploy Vercel
```

---

## 6. Rotas da API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/usuarios/registro` | ✗ | Cadastrar usuário |
| POST | `/usuarios/google-sync` | ✓ | Sincronizar login Google |
| GET | `/usuarios/me` | ✓ | Dados do usuário logado |
| GET | `/animais` | ✗ | Listar animais disponíveis |
| GET | `/animais/admin` | ADMIN | Listar todos os animais |
| POST | `/animais` | ADMIN | Cadastrar animal |
| PUT | `/animais/:id` | ADMIN | Editar animal |
| DELETE | `/animais/:id` | ADMIN | Remover animal |
| GET | `/favoritos` | ✓ | Meus favoritos |
| POST | `/favoritos` | ✓ | Adicionar favorito |
| DELETE | `/favoritos/:animal_id` | ✓ | Remover favorito |
| GET | `/agendamentos/me` | ✓ | Meus agendamentos |
| POST | `/agendamentos` | ✓ | Criar agendamento |
| GET | `/agendamentos` | ADMIN | Todos os agendamentos |
| PUT | `/agendamentos/:id/status` | ADMIN | Atualizar status |

---

## 7. Perfis de usuário

| Tipo | Acesso |
|---|---|
| `ADOTANTE` | Dashboard, lista de animais, favoritos, agendamentos |
| `ADMIN` | Painel admin, cadastro/edição de animais, gestão de agendamentos |

O tipo é definido no cadastro e armazenado como **custom claim** no Firebase Auth.
