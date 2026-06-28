import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3).max(80),
  course: z.string().min(3).max(120),
  bio: z.string().max(600).optional().default(""),
  avatarUrl: z
    .string()
    .max(250000)
    .refine((value) => !value || value.startsWith("data:image/") || z.string().url().safeParse(value).success, {
      message: "Informe uma URL valida ou uma imagem em base64."
    })
    .nullable()
    .optional()
});
