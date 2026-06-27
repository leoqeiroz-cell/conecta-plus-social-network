import { Router } from "express";
import { authController } from "@/controllers/auth.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";

export const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", ensureAuthenticated, authController.me);
