import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "@/errors/app-error.js";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(422).json({
      message: "Dados invalidos.",
      issues: error.flatten().fieldErrors
    });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor." });
}
