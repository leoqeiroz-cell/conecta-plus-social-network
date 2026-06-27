import { PostCategory } from "@prisma/client";
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(4).max(120),
  content: z.string().min(10).max(2200),
  category: z.nativeEnum(PostCategory),
  tags: z.array(z.string().min(2).max(24)).min(1).max(5)
});

export const updatePostSchema = createPostSchema.partial();

export const commentSchema = z.object({
  content: z.string().min(2).max(600)
});

export const postQuerySchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(PostCategory).optional(),
  tag: z.string().optional()
});
