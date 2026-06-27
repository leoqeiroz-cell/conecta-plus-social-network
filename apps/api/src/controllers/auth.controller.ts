import { Request, Response } from "express";
import { authService } from "@/services/auth.service.js";
import { loginSchema, registerSchema } from "@/schemas/auth.schema.js";

export const authController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const response = await authService.register(data);
    return res.status(201).json(response);
  },

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const response = await authService.login(data.email, data.password);
    return res.json(response);
  },

  async me(req: Request, res: Response) {
    const response = await authService.me(req.user!.id);
    return res.json(response);
  }
};
