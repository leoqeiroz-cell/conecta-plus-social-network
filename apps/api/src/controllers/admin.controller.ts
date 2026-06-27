import { Request, Response } from "express";
import { adminService } from "@/services/admin.service.js";

export const adminController = {
  async metrics(_req: Request, res: Response) {
    const metrics = await adminService.metrics();
    return res.json(metrics);
  }
};
