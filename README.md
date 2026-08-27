# Whiskerworld

Whiskerworld e um sistema web para aproximar adotantes, ONGs e administradores no processo de adocao de caes e gatos. A aplicacao permite visualizar pets disponiveis, cadastrar usuarios, autenticar adotantes e administradores, favoritar animais, solicitar/agendar visitas e gerenciar pets e agendamentos pela area administrativa.

## Requisitos Atendidos

- Compatibilidade com a documentacao: arquitetura em camadas com separacao entre frontend, controllers, services, repositories e banco MySQL.
- API REST: endpoints `GET`, `POST`, `PUT` e `DELETE` para usuarios, animais, favoritos e agendamentos.
- Seguranca: senhas com `bcrypt`, autenticacao JWT e CORS configuravel por ambiente.
- Responsividade: frontend React/Vite com estilos responsivos para apresentacao em desktop e mobile.
- Separacao de responsabilidades: frontend em `client/`, backend Express em `backend/` e dumps SQL em `backend/db/`.

## Tecnologias

- Node.js + Express
- MySQL com `mysql2/promise`
- React + Vite
- JWT para autenticacao
- Bcrypt para criptografia de senhas
- Swagger UI para documentacao da API

## Configuracao Local

1. Instale as dependencias:

```bash
npm run install:all
```

2. Crie o arquivo `.env` a partir de `.env.example`:

```powershell
Copy-Item .env.example .env
```

3. Crie a base MySQL:

```bash
npm run db:import
```

Se preferir usar o cliente do Laragon diretamente e ele nao estiver no PATH:

```powershell
& "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root < backend\db\dump.sql
```

Para reaplicar somente os dados iniciais sem recriar as tabelas:

```bash
npm run db:seed
```

4. Confira a conexao com o banco:

```bash
npm run db:test
```

5. Suba backend e frontend para apresentacao em localhost:

```bash
npm run dev
```

URLs principais:

- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3000/api`
- Healthcheck: `http://localhost:3000/api/health`
- Swagger: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs.json`

## Variaveis de Ambiente

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=whiskerworld
DB_CONNECTION_LIMIT=10
JWT_SECRET=troque_este_segredo_em_producao
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## API REST

Todas as rotas da API usam o prefixo `/api`.

Usuarios:

- `POST /api/usuarios/registro`
- `POST /api/usuarios/login`
- `GET /api/usuarios/me`

Animais:

- `GET /api/animais`
- `GET /api/animais?tipo=GATO`
- `GET /api/animais/:id`
- `GET /api/animais/admin`
- `POST /api/animais`
- `PUT /api/animais/:id`
- `DELETE /api/animais/:id`

Favoritos:

- `GET /api/favoritos`
- `POST /api/favoritos`
- `DELETE /api/favoritos/:animal_id`

Agendamentos:

- `POST /api/agendamentos`
- `GET /api/agendamentos/me`
- `GET /api/agendamentos`
- `PUT /api/agendamentos/:id/status`
- `DELETE /api/agendamentos/:id`

Rotas protegidas exigem header:

```http
Authorization: Bearer <token>
```

## Banco de Dados

O dump oficial esta em `backend/db/dump.sql` e cria a base `whiskerworld` com:

- `usuarios`
- `animais`
- `agendamentos`
- `favoritos`

O modelo contempla os campos principais documentados para pets: nome, especie/tipo, idade, sexo, porte, raca, descricao, historico, foto, vacinacao e status.

Usuarios iniciais do dump:

- Admin: `admin@whiskerworld.com` / `123456`
- Adotante: `lili@whiskerworld.com` / `123456`

A seed separada esta em `backend/db/seed.sql` e pode ser aplicada com `npm run db:seed`.

## Scripts

- `npm start`: inicia apenas o backend.
- `npm run dev`: inicia backend e frontend juntos.
- `npm run dev:backend`: inicia o Express em `localhost:3000`.
- `npm run dev:frontend`: inicia o Vite em `localhost:5173`.
- `npm run build:frontend`: gera build do frontend.
- `npm run db:test`: testa conexao MySQL.
- `npm run db:import`: cria/recria a base local com tabelas e dados iniciais.
- `npm run db:seed`: limpa e repovoa os dados iniciais da base existente.
- `npm run install:all`: instala dependencias da raiz e do client.

## Observacoes

- `http://localhost:5173` para demonstrar a interface.
- `http://localhost:3000/api/docs` para demonstrar a API REST no Swagger.
- O backend aceita imagens JPG, JPEG e PNG de ate 5 MB no cadastro de animais.
