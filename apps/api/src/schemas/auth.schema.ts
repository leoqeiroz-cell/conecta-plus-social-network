import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  course: z.string().min(2).max(80),
  bio: z.string().max(240).optional(),
  avatarUrl: z.string().url().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
