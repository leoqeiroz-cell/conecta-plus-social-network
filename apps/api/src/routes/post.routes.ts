import { Router } from "express";
import { postController } from "@/controllers/post.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";

export const postRoutes = Router();

postRoutes.get("/", postController.list);
postRoutes.post("/", ensureAuthenticated, postController.create);
postRoutes.put("/:id", ensureAuthenticated, postController.update);
postRoutes.delete("/:id", ensureAuthenticated, postController.delete);
postRoutes.post("/:id/like", ensureAuthenticated, postController.toggleLike);
postRoutes.post("/:id/comments", ensureAuthenticated, postController.addComment);
