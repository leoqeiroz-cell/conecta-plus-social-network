import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import type { Express } from "express";

let app: Express;

beforeAll(async () => {
  process.env.DATABASE_URL ??= "postgresql://conecta:conecta@localhost:5432/conecta_plus?schema=public";
  process.env.JWT_SECRET ??= "segredo-de-teste-com-tamanho-seguro";
  process.env.JWT_EXPIRES_IN ??= "1h";
  process.env.CORS_ORIGIN ??= "http://localhost:5173";

  const module = await import("../app.js");
  app = module.app;
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
});
