import { NextFunction, Request, Response } from "express";
import { AppError } from "@/errors/app-error.js";
import { verifyToken } from "@/utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "USER" | "ADMIN";
      };
    }
  }
}

export function ensureAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Token de autenticacao ausente.", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyToken(token);
  req.user = { id: payload.sub, role: payload.role };
  return next();
}

export function ensureAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    throw new AppError("Acesso restrito ao administrador.", 403);
  }

  return next();
}
