import { Router } from "express";
import { adminRoutes } from "@/routes/admin.routes.js";
import { authRoutes } from "@/routes/auth.routes.js";
import { groupRoutes } from "@/routes/group.routes.js";
import { postRoutes } from "@/routes/post.routes.js";
import { userRoutes } from "@/routes/user.routes.js";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ status: "ok", name: "Conecta+ API" }));
routes.use("/auth", authRoutes);
routes.use("/posts", postRoutes);
routes.use("/users", userRoutes);
routes.use("/groups", groupRoutes);
routes.use("/admin", adminRoutes);
