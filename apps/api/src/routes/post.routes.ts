import { Router } from "express";
import { postController } from "@/controllers/post.controller.js";
import { ensureAuthenticated } from "@/middlewares/auth.js";
import { asyncHandler } from "@/utils/async-handler.js";

export const postRoutes = Router();

postRoutes.get("/", asyncHandler(postController.list));
postRoutes.post("/", ensureAuthenticated, asyncHandler(postController.create));
postRoutes.put("/:id", ensureAuthenticated, asyncHandler(postController.update));
postRoutes.delete("/:id", ensureAuthenticated, asyncHandler(postController.delete));
postRoutes.post("/:id/like", ensureAuthenticated, asyncHandler(postController.toggleLike));
postRoutes.post("/:id/comments", ensureAuthenticated, asyncHandler(postController.addComment));
postRoutes.put("/comments/:commentId", ensureAuthenticated, asyncHandler(postController.updateComment));
postRoutes.delete("/comments/:commentId", ensureAuthenticated, asyncHandler(postController.deleteComment));
