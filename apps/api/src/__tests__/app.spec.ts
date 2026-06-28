import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Express } from "express";
import type { PrismaClient, User } from "@prisma/client";

let app: Express;
let prisma: PrismaClient;
let originalAdmin: User | null = null;
let createdPostId: string | null = null;
let createdCommentId: string | null = null;

beforeAll(async () => {
  process.env.DATABASE_URL ??= "postgresql://conecta:conecta@localhost:5432/conecta_plus?schema=public";
  process.env.JWT_SECRET ??= "segredo-de-teste-com-tamanho-seguro";
  process.env.JWT_EXPIRES_IN ??= "1h";
  process.env.CORS_ORIGIN ??= "http://localhost:5173";

  const module = await import("../app.js");
  app = module.app;
  const prismaModule = await import("../config/prisma.js");
  prisma = prismaModule.prisma;
  originalAdmin = await prisma.user.findUnique({ where: { email: "admin@conectamais.edu" } });
});

afterAll(async () => {
  if (createdCommentId) await prisma.comment.deleteMany({ where: { id: createdCommentId } });
  if (createdPostId) await prisma.post.deleteMany({ where: { id: createdPostId } });
  if (originalAdmin) {
    await prisma.user.update({
      where: { id: originalAdmin.id },
      data: {
        name: originalAdmin.name,
        course: originalAdmin.course,
        bio: originalAdmin.bio,
        avatarUrl: originalAdmin.avatarUrl,
        points: originalAdmin.points
      }
    });
  }
  await prisma.$disconnect();
});

describe("Conecta+ API", () => {
  it("retorna health check da API", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", name: "Conecta+ API" });
  });

  it("bloqueia rota protegida sem token JWT", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token de autenticacao ausente.");
  });

  it("valida formato de login antes de acessar a regra de negocio", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "email-invalido",
      password: "123"
    });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Dados invalidos.");
    expect(response.body.issues).toHaveProperty("email");
  });

  it("permite gerenciar publicacao, curtida e comentario autenticados", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "admin@conectamais.edu",
      password: "Conecta@123"
    });
    const token = login.body.token as string;

    const created = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Postagem automatizada para testes",
        content: "Conteudo criado para validar edicao, curtida e comentarios da API.",
        category: "ESTUDOS",
        tags: ["estudos"]
      });

    expect(created.status).toBe(201);
    createdPostId = created.body.id;

    const updated = await request(app)
      .put(`/api/posts/${createdPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Postagem automatizada atualizada",
        content: "Conteudo atualizado pelo teste automatizado de API.",
        category: "PROJETOS",
        tags: ["projetos"]
      });

    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe("Postagem automatizada atualizada");
    expect(updated.body.category).toBe("PROJETOS");

    const liked = await request(app).post(`/api/posts/${createdPostId}/like`).set("Authorization", `Bearer ${token}`);
    const unliked = await request(app).post(`/api/posts/${createdPostId}/like`).set("Authorization", `Bearer ${token}`);

    expect(liked.body).toEqual({ liked: true });
    expect(unliked.body).toEqual({ liked: false });

    const comment = await request(app)
      .post(`/api/posts/${createdPostId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Comentario criado pelo teste automatizado." });

    expect(comment.status).toBe(201);
    createdCommentId = comment.body.id;

    const editedComment = await request(app)
      .put(`/api/posts/comments/${createdCommentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Comentario atualizado pelo teste automatizado." });

    expect(editedComment.status).toBe(200);
    expect(editedComment.body.content).toBe("Comentario atualizado pelo teste automatizado.");

    const deletedComment = await request(app).delete(`/api/posts/comments/${createdCommentId}`).set("Authorization", `Bearer ${token}`);
    expect(deletedComment.body).toEqual({ ok: true });
    createdCommentId = null;

    const deletedPost = await request(app).delete(`/api/posts/${createdPostId}`).set("Authorization", `Bearer ${token}`);
    expect(deletedPost.body).toEqual({ ok: true });
    createdPostId = null;
  });

  it("atualiza perfil autenticado com avatar", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "admin@conectamais.edu",
      password: "Conecta@123"
    });
    const token = login.body.token as string;

    const response = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Leonardo Queiroz",
        course: "Desenvolvimento Full Stack",
        bio: "Perfil atualizado durante teste automatizado.",
        avatarUrl: "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
      });

    expect(response.status).toBe(200);
    expect(response.body.bio).toBe("Perfil atualizado durante teste automatizado.");
    expect(response.body.avatarUrl).toContain("data:image/svg+xml");
  });
});
