import { Router } from "express";
import { authController } from "@/controllers/auth.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";
import { asyncHandler } from "@/utils/async-handler.js";

export const authRoutes = Router();

authRoutes.post("/register", asyncHandler(authController.register));
authRoutes.post("/login", asyncHandler(authController.login));
authRoutes.get("/me", ensureAuthenticated, asyncHandler(authController.me));
