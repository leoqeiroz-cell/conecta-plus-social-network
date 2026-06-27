import { Request, Response } from "express";
import { groupService } from "@/services/group.service.js";

export const groupController = {
  async list(req: Request, res: Response) {
    const groups = await groupService.list(req.user?.id);
    return res.json(groups);
  },

  async toggle(req: Request, res: Response) {
    const groupId = String(req.params.id);
    const result = await groupService.toggleMembership(groupId, req.user!.id);
    return res.json(result);
  }
};
