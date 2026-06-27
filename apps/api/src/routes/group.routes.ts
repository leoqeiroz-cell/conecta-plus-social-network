import { Router } from "express";
import { groupController } from "@/controllers/group.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";

export const groupRoutes = Router();

groupRoutes.get("/", ensureAuthenticated, groupController.list);
groupRoutes.post("/:id/join", ensureAuthenticated, groupController.toggle);
