const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Whiskerworld API",
    version: "1.0.0",
    description:
      "API REST do sistema Whiskerworld para adocao de pets, usuarios, favoritos e agendamentos.",
  },
  servers: [
    { url: "http://localhost:3000/api", description: "Localhost" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      UsuarioRegistro: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: { type: "string", example: "Maria Silva" },
          email: { type: "string", example: "maria@email.com" },
          senha: { type: "string", example: "123456" },
          tipo: { type: "string", enum: ["ADMIN", "ADOTANTE"], example: "ADOTANTE" },
        },
      },
      Login: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", example: "admin@whiskerworld.com" },
          senha: { type: "string", example: "123456" },
        },
      },
      Animal: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Gatuno" },
          idade: { type: "string", example: "3 anos" },
          sexo: { type: "string", enum: ["MACHO", "FEMEA"] },
          tipo: { type: "string", enum: ["CAO", "GATO"] },
          raca: { type: "string", example: "SRD" },
          porte: { type: "string", enum: ["PEQUENO", "MEDIO", "GRANDE"] },
          vacinado: { type: "boolean", example: true },
          status: { type: "string", enum: ["DISPONIVEL", "EM_PROCESSO", "ADOTADO"] },
          descricao: { type: "string" },
          historico: { type: "string" },
          foto_url: { type: "string" },
        },
      },
      Agendamento: {
        type: "object",
        required: ["animal_id", "data_visita", "hora_visita"],
        properties: {
          animal_id: { type: "integer", example: 1 },
          data_visita: { type: "string", format: "date", example: "2026-06-10" },
          hora_visita: { type: "string", example: "08:00:00" },
          observacoes: { type: "string", example: "Tenho interesse em conhecer o pet." },
        },
      },
      StatusAgendamento: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["PENDENTE", "CONFIRMADO", "CANCELADO"] },
        },
      },
      Favorito: {
        type: "object",
        required: ["animal_id"],
        properties: {
          animal_id: { type: "integer", example: 1 },
        },
      },
      Mensagem: {
        type: "object",
        properties: {
          mensagem: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Sistema"],
        summary: "Verifica disponibilidade da API",
        responses: { 200: { description: "API ativa" } },
      },
    },
    "/usuarios/registro": {
      post: {
        tags: ["Usuarios"],
        summary: "Cadastra um usuario",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioRegistro" } } },
        },
        responses: { 201: { description: "Usuario cadastrado" }, 409: { description: "E-mail duplicado" } },
      },
    },
    "/usuarios/login": {
      post: {
        tags: ["Usuarios"],
        summary: "Autentica usuario e retorna JWT",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } },
        },
        responses: { 200: { description: "Login realizado" }, 401: { description: "Credenciais invalidas" } },
      },
    },
    "/usuarios/me": {
      get: {
        tags: ["Usuarios"],
        security: [{ bearerAuth: [] }],
        summary: "Retorna usuario autenticado",
        responses: { 200: { description: "Usuario logado" }, 401: { description: "Nao autenticado" } },
      },
    },
    "/animais": {
      get: {
        tags: ["Animais"],
        summary: "Lista animais disponiveis",
        parameters: [{ name: "tipo", in: "query", schema: { type: "string", enum: ["CAO", "GATO"] } }],
        responses: { 200: { description: "Lista de animais" } },
      },
      post: {
        tags: ["Animais"],
        security: [{ bearerAuth: [] }],
        summary: "Cadastra animal (ADMIN)",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Animal" },
                  { type: "object", properties: { foto: { type: "string", format: "binary" } } },
                ],
              },
            },
          },
        },
        responses: { 201: { description: "Animal cadastrado" }, 403: { description: "Apenas admin" } },
      },
    },
    "/animais/admin": {
      get: {
        tags: ["Animais"],
        security: [{ bearerAuth: [] }],
        summary: "Lista todos os animais (ADMIN)",
        responses: { 200: { description: "Lista administrativa" } },
      },
    },
    "/animais/{id}": {
      get: {
        tags: ["Animais"],
        summary: "Busca animal por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Animal encontrado" }, 404: { description: "Animal nao encontrado" } },
      },
      put: {
        tags: ["Animais"],
        security: [{ bearerAuth: [] }],
        summary: "Atualiza animal (ADMIN)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { content: { "multipart/form-data": { schema: { $ref: "#/components/schemas/Animal" } } } },
        responses: { 200: { description: "Animal atualizado" } },
      },
      delete: {
        tags: ["Animais"],
        security: [{ bearerAuth: [] }],
        summary: "Remove animal (ADMIN)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Animal removido" } },
      },
    },
    "/favoritos": {
      get: {
        tags: ["Favoritos"],
        security: [{ bearerAuth: [] }],
        summary: "Lista favoritos do usuario",
        responses: { 200: { description: "Lista de favoritos" } },
      },
      post: {
        tags: ["Favoritos"],
        security: [{ bearerAuth: [] }],
        summary: "Cria favorito",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Favorito" } } } },
        responses: { 201: { description: "Favorito criado" } },
      },
    },
    "/favoritos/{animal_id}": {
      delete: {
        tags: ["Favoritos"],
        security: [{ bearerAuth: [] }],
        summary: "Remove favorito",
        parameters: [{ name: "animal_id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Favorito removido" } },
      },
    },
    "/agendamentos": {
      get: {
        tags: ["Agendamentos"],
        security: [{ bearerAuth: [] }],
        summary: "Lista todos os agendamentos (ADMIN)",
        responses: { 200: { description: "Lista de agendamentos" } },
      },
      post: {
        tags: ["Agendamentos"],
        security: [{ bearerAuth: [] }],
        summary: "Cria agendamento",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Agendamento" } } } },
        responses: { 201: { description: "Agendamento criado" } },
      },
    },
    "/agendamentos/me": {
      get: {
        tags: ["Agendamentos"],
        security: [{ bearerAuth: [] }],
        summary: "Lista agendamentos do usuario",
        responses: { 200: { description: "Meus agendamentos" } },
      },
    },
    "/agendamentos/{id}/status": {
      put: {
        tags: ["Agendamentos"],
        security: [{ bearerAuth: [] }],
        summary: "Atualiza status do agendamento (ADMIN)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/StatusAgendamento" } } } },
        responses: { 200: { description: "Status atualizado" } },
      },
    },
    "/agendamentos/{id}": {
      delete: {
        tags: ["Agendamentos"],
        security: [{ bearerAuth: [] }],
        summary: "Cancela/remove agendamento",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Agendamento removido" } },
      },
    },
  },
};

function setupSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get("/api/docs.json", (_req, res) => res.json(swaggerDocument));
}

module.exports = setupSwagger;
