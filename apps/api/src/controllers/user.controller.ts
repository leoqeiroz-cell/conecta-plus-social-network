import { Request, Response } from "express";
import { userService } from "@/services/user.service.js";

export const userController = {
  async search(req: Request, res: Response) {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const users = await userService.search(query);
    return res.json(users);
  },

  async leaderboard(_req: Request, res: Response) {
    const users = await userService.leaderboard();
    return res.json(users);
  }
};
