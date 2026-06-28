import { Router } from "express";
import { adminController } from "@/controllers/admin.controller.js";
import { ensureAdmin, ensureAuthenticated } from "@/middlewares/auth.js";
import { asyncHandler } from "@/utils/async-handler.js";

export const adminRoutes = Router();

adminRoutes.get("/metrics", ensureAuthenticated, ensureAdmin, asyncHandler(adminController.metrics));
