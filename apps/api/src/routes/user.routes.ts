import { Router } from "express";
import { userController } from "@/controllers/user.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";
import { asyncHandler } from "@/utils/async-handler.js";

export const userRoutes = Router();

userRoutes.get("/search", ensureAuthenticated, asyncHandler(userController.search));
userRoutes.put("/me", ensureAuthenticated, asyncHandler(userController.updateProfile));
userRoutes.get("/leaderboard", asyncHandler(userController.leaderboard));
