const json = (schema: Record<string, unknown>) => ({
  content: {
    "application/json": {
      schema
    }
  }
});

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const authSecurity = [{ bearerAuth: [] }];

const idParameter = (name: string, description: string) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string", format: "uuid" }
});

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Conecta+ API",
    version: "1.0.0",
    description:
      "API REST para rede social academica e comunitaria com autenticacao JWT, feed, comentarios, curtidas, grupos, ranking e painel administrativo."
  },
  servers: [{ url: "http://localhost:3333/api", description: "Ambiente local" }],
  tags: [
    { name: "Health", description: "Disponibilidade da API" },
    { name: "Auth", description: "Cadastro, login e sessao autenticada" },
    { name: "Posts", description: "Feed, CRUD, curtidas e comentarios" },
    { name: "Users", description: "Busca de usuarios e ranking" },
    { name: "Groups", description: "Modo comunidade e grupos de estudo" },
    { name: "Admin", description: "Indicadores administrativos" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Token de autenticacao ausente." }
        }
      },
      ValidationErrorResponse: {
        type: "object",
        required: ["message", "issues"],
        properties: {
          message: { type: "string", example: "Dados invalidos." },
          issues: {
            type: "object",
            additionalProperties: {
              type: "array",
              items: { type: "string" }
            },
            example: { email: ["Invalid email"] }
          }
        }
      },
      User: {
        type: "object",
        required: ["id", "name", "email", "course", "bio", "role", "points"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Ana Silva" },
          email: { type: "string", format: "email", example: "ana@conectamais.edu" },
          course: { type: "string", example: "Analise e Desenvolvimento de Sistemas" },
          bio: { type: "string", example: "Gosto de ajudar em logica, APIs e organizacao de estudos." },
          avatarUrl: { type: "string", nullable: true, example: null },
          role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
          points: { type: "integer", example: 88 }
        }
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password", "course"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 80, example: "Maria Oliveira" },
          email: { type: "string", format: "email", example: "maria@conectamais.edu" },
          password: { type: "string", minLength: 8, maxLength: 72, example: "Conecta@123" },
          course: { type: "string", minLength: 2, maxLength: 80, example: "Desenvolvimento Full Stack" },
          bio: { type: "string", maxLength: 240, example: "Estudante interessada em comunidades de aprendizagem." },
          avatarUrl: { type: "string", format: "uri", example: "https://example.com/avatar.png" }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@conectamais.edu" },
          password: { type: "string", minLength: 8, example: "Conecta@123" }
        }
      },
      AuthResponse: {
        type: "object",
        required: ["token", "user"],
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          user: ref("User")
        }
      },
      Tag: {
        type: "object",
        required: ["tag"],
        properties: {
          tag: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string", example: "estudos" }
            }
          }
        }
      },
      Comment: {
        type: "object",
        required: ["id", "content", "createdAt", "author"],
        properties: {
          id: { type: "string", format: "uuid" },
          content: { type: "string", example: "Excelente contribuicao para a comunidade." },
          createdAt: { type: "string", format: "date-time" },
          author: ref("User")
        }
      },
      Post: {
        type: "object",
        required: ["id", "title", "content", "category", "author", "comments", "likes", "tags"],
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", example: "Trilha de estudos para API REST com Express" },
          content: {
            type: "string",
            example: "Organizei um roteiro com HTTP, middlewares, validacao com Zod, Prisma e testes basicos."
          },
          category: { type: "string", enum: ["ESTUDOS", "PROJETOS", "EMPREGO", "DUVIDAS"], example: "ESTUDOS" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          author: ref("User"),
          comments: { type: "array", items: ref("Comment") },
          likes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                authorId: { type: "string", format: "uuid" }
              }
            }
          },
          tags: { type: "array", items: ref("Tag") }
        }
      },
      CreatePostInput: {
        type: "object",
        required: ["title", "content", "category", "tags"],
        properties: {
          title: { type: "string", minLength: 4, maxLength: 120, example: "Dicas para estudar TypeScript" },
          content: { type: "string", minLength: 10, maxLength: 2200, example: "Compartilho um roteiro pratico para revisar tipos, interfaces e generics." },
          category: { type: "string", enum: ["ESTUDOS", "PROJETOS", "EMPREGO", "DUVIDAS"], example: "ESTUDOS" },
          tags: { type: "array", minItems: 1, maxItems: 5, items: { type: "string" }, example: ["estudos", "duvidas"] }
        }
      },
      UpdatePostInput: {
        allOf: [ref("CreatePostInput")],
        description: "Todos os campos sao opcionais para atualizacao parcial."
      },
      CommentInput: {
        type: "object",
        required: ["content"],
        properties: {
          content: { type: "string", minLength: 2, maxLength: 600, example: "Esse material ajudou bastante." }
        }
      },
      LikeResponse: {
        type: "object",
        required: ["liked"],
        properties: {
          liked: { type: "boolean", example: true }
        }
      },
      DeleteResponse: {
        type: "object",
        required: ["ok"],
        properties: {
          ok: { type: "boolean", example: true }
        }
      },
      StudyGroup: {
        type: "object",
        required: ["id", "name", "description", "category", "membersCount", "isMember"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Grupo Full Stack" },
          description: { type: "string", example: "Encontros semanais para estudar frontend, backend e deploy." },
          category: { type: "string", enum: ["ESTUDOS", "PROJETOS", "EMPREGO", "DUVIDAS"], example: "ESTUDOS" },
          membersCount: { type: "integer", example: 12 },
          isMember: { type: "boolean", example: true }
        }
      },
      GroupMembershipResponse: {
        type: "object",
        required: ["joined"],
        properties: {
          joined: { type: "boolean", example: true }
        }
      },
      AdminMetrics: {
        type: "object",
        required: ["users", "posts", "groups", "admins", "leaderboard", "recentPosts"],
        properties: {
          users: { type: "integer", example: 4 },
          posts: { type: "integer", example: 3 },
          groups: { type: "integer", example: 3 },
          admins: { type: "integer", example: 1 },
          leaderboard: { type: "array", items: ref("User") },
          recentPosts: { type: "array", items: ref("Post") }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica disponibilidade da API",
        responses: {
          "200": {
            description: "API operacional",
            ...json({
              type: "object",
              properties: {
                status: { type: "string", example: "ok" },
                name: { type: "string", example: "Conecta+ API" }
              }
            })
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Cria uma conta",
        requestBody: { required: true, ...json(ref("RegisterInput")) },
        responses: {
          "201": { description: "Conta criada", ...json(ref("AuthResponse")) },
          "409": { description: "E-mail ja cadastrado", ...json(ref("ErrorResponse")) },
          "422": { description: "Dados invalidos", ...json(ref("ValidationErrorResponse")) }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Autentica usuario",
        requestBody: { required: true, ...json(ref("LoginInput")) },
        responses: {
          "200": { description: "Token JWT e usuario", ...json(ref("AuthResponse")) },
          "401": { description: "Credenciais invalidas", ...json(ref("ErrorResponse")) },
          "422": { description: "Dados invalidos", ...json(ref("ValidationErrorResponse")) }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Retorna usuario autenticado",
        security: authSecurity,
        responses: {
          "200": { description: "Usuario autenticado", ...json(ref("User")) },
          "401": { description: "Token ausente ou invalido", ...json(ref("ErrorResponse")) }
        }
      }
    },
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Lista publicacoes com filtros",
        parameters: [
          { name: "search", in: "query", required: false, schema: { type: "string" }, description: "Busca por titulo, conteudo ou autor" },
          { name: "category", in: "query", required: false, schema: { type: "string", enum: ["ESTUDOS", "PROJETOS", "EMPREGO", "DUVIDAS"] } },
          { name: "tag", in: "query", required: false, schema: { type: "string" }, description: "Tag com ou sem #" }
        ],
        responses: {
          "200": { description: "Feed de publicacoes", ...json({ type: "array", items: ref("Post") }) }
        }
      },
      post: {
        tags: ["Posts"],
        summary: "Cria publicacao",
        security: authSecurity,
        requestBody: { required: true, ...json(ref("CreatePostInput")) },
        responses: {
          "201": { description: "Publicacao criada", ...json(ref("Post")) },
          "401": { description: "Token ausente ou invalido", ...json(ref("ErrorResponse")) },
          "422": { description: "Dados invalidos", ...json(ref("ValidationErrorResponse")) }
        }
      }
    },
    "/posts/{id}": {
      put: {
        tags: ["Posts"],
        summary: "Atualiza publicacao do autor",
        security: authSecurity,
        parameters: [idParameter("id", "ID da publicacao")],
        requestBody: { required: true, ...json(ref("UpdatePostInput")) },
        responses: {
          "200": { description: "Publicacao atualizada", ...json(ref("Post")) },
          "403": { description: "Usuario nao e autor da publicacao", ...json(ref("ErrorResponse")) },
          "404": { description: "Publicacao nao encontrada", ...json(ref("ErrorResponse")) }
        }
      },
      delete: {
        tags: ["Posts"],
        summary: "Remove publicacao do autor ou por administrador",
        security: authSecurity,
        parameters: [idParameter("id", "ID da publicacao")],
        responses: {
          "200": { description: "Publicacao removida", ...json(ref("DeleteResponse")) },
          "403": { description: "Acao nao permitida", ...json(ref("ErrorResponse")) },
          "404": { description: "Publicacao nao encontrada", ...json(ref("ErrorResponse")) }
        }
      }
    },
    "/posts/{id}/like": {
      post: {
        tags: ["Posts"],
        summary: "Alterna curtida",
        security: authSecurity,
        parameters: [idParameter("id", "ID da publicacao")],
        responses: {
          "200": { description: "Estado atualizado da curtida", ...json(ref("LikeResponse")) },
          "404": { description: "Publicacao nao encontrada", ...json(ref("ErrorResponse")) }
        }
      }
    },
    "/posts/{id}/comments": {
      post: {
        tags: ["Posts"],
        summary: "Adiciona comentario",
        security: authSecurity,
        parameters: [idParameter("id", "ID da publicacao")],
        requestBody: { required: true, ...json(ref("CommentInput")) },
        responses: {
          "201": { description: "Comentario criado", ...json(ref("Comment")) },
          "404": { description: "Publicacao nao encontrada", ...json(ref("ErrorResponse")) },
          "422": { description: "Dados invalidos", ...json(ref("ValidationErrorResponse")) }
        }
      }
    },
    "/users/search": {
      get: {
        tags: ["Users"],
        summary: "Busca usuarios por nome, e-mail ou curso",
        security: authSecurity,
        parameters: [{ name: "q", in: "query", required: false, schema: { type: "string" } }],
        responses: {
          "200": { description: "Usuarios encontrados", ...json({ type: "array", items: ref("User") }) }
        }
      }
    },
    "/users/leaderboard": {
      get: {
        tags: ["Users"],
        summary: "Lista ranking publico de colaboracao",
        responses: {
          "200": { description: "Top usuarios por pontuacao", ...json({ type: "array", items: ref("User") }) }
        }
      }
    },
    "/groups": {
      get: {
        tags: ["Groups"],
        summary: "Lista grupos de estudo",
        security: authSecurity,
        responses: {
          "200": { description: "Grupos com quantidade de membros e status do usuario", ...json({ type: "array", items: ref("StudyGroup") }) }
        }
      }
    },
    "/groups/{id}/join": {
      post: {
        tags: ["Groups"],
        summary: "Entra ou sai de um grupo",
        security: authSecurity,
        parameters: [idParameter("id", "ID do grupo")],
        responses: {
          "200": { description: "Estado atualizado da participacao", ...json(ref("GroupMembershipResponse")) }
        }
      }
    },
    "/admin/metrics": {
      get: {
        tags: ["Admin"],
        summary: "Retorna indicadores administrativos",
        security: authSecurity,
        responses: {
          "200": { description: "Metricas da comunidade", ...json(ref("AdminMetrics")) },
          "403": { description: "Acesso restrito ao administrador", ...json(ref("ErrorResponse")) }
        }
      }
    }
  }
};
