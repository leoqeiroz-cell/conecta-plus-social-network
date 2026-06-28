import { Router } from "express";
import { groupController } from "@/controllers/group.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";
import { asyncHandler } from "@/utils/async-handler.js";

export const groupRoutes = Router();

groupRoutes.get("/", ensureAuthenticated, asyncHandler(groupController.list));
groupRoutes.post("/:id/join", ensureAuthenticated, asyncHandler(groupController.toggle));
