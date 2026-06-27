import { Request, Response } from "express";
import { commentSchema, createPostSchema, postQuerySchema, updatePostSchema } from "@/schemas/post.schema.js";
import { postService } from "@/services/post.service.js";

export const postController = {
  async list(req: Request, res: Response) {
    const filters = postQuerySchema.parse(req.query);
    const posts = await postService.list(filters);
    return res.json(posts);
  },

  async create(req: Request, res: Response) {
    const data = createPostSchema.parse(req.body);
    const post = await postService.create(req.user!.id, data);
    return res.status(201).json(post);
  },

  async update(req: Request, res: Response) {
    const data = updatePostSchema.parse(req.body);
    const postId = String(req.params.id);
    const post = await postService.update(postId, req.user!.id, data);
    return res.json(post);
  },

  async delete(req: Request, res: Response) {
    const postId = String(req.params.id);
    const response = await postService.delete(postId, req.user!.id, req.user!.role);
    return res.json(response);
  },

  async toggleLike(req: Request, res: Response) {
    const postId = String(req.params.id);
    const response = await postService.toggleLike(postId, req.user!.id);
    return res.json(response);
  },

  async addComment(req: Request, res: Response) {
    const data = commentSchema.parse(req.body);
    const postId = String(req.params.id);
    const comment = await postService.addComment(postId, req.user!.id, data.content);
    return res.status(201).json(comment);
  }
};
