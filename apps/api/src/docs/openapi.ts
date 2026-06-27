export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Conecta+ API",
    version: "1.0.0",
    description: "API REST para rede social academica e comunitaria."
  },
  servers: [{ url: "http://localhost:3333/api" }],
  tags: [
    { name: "Auth" },
    { name: "Posts" },
    { name: "Users" },
    { name: "Groups" },
    { name: "Admin" }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Auth"],
        summary: "Verifica disponibilidade da API",
        responses: { "200": { description: "API operacional" } }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Cria uma conta",
        responses: { "201": { description: "Conta criada" } }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Autentica usuario",
        responses: { "200": { description: "Token JWT e usuario" } }
      }
    },
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Lista publicacoes com filtros",
        responses: { "200": { description: "Feed" } }
      },
      post: {
        tags: ["Posts"],
        summary: "Cria publicacao",
        responses: { "201": { description: "Publicacao criada" } }
      }
    },
    "/posts/{id}/like": {
      post: {
        tags: ["Posts"],
        summary: "Alterna curtida",
        responses: { "200": { description: "Estado da curtida" } }
      }
    },
    "/posts/{id}/comments": {
      post: {
        tags: ["Posts"],
        summary: "Adiciona comentario",
        responses: { "201": { description: "Comentario criado" } }
      }
    },
    "/users/search": {
      get: {
        tags: ["Users"],
        summary: "Busca usuarios",
        responses: { "200": { description: "Usuarios encontrados" } }
      }
    },
    "/groups": {
      get: {
        tags: ["Groups"],
        summary: "Lista grupos de estudo",
        responses: { "200": { description: "Grupos" } }
      }
    },
    "/admin/metrics": {
      get: {
        tags: ["Admin"],
        summary: "Retorna indicadores administrativos",
        responses: { "200": { description: "Metricas" } }
      }
    }
  }
};
