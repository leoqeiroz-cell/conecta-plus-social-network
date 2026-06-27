import { Router } from "express";
import { userController } from "@/controllers/user.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";

export const userRoutes = Router();

userRoutes.get("/search", ensureAuthenticated, userController.search);
userRoutes.get("/leaderboard", userController.leaderboard);
