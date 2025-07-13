import { Request, Response } from "express";
import { AdminLoginuseCase } from "../../../useCases/admin/Login/AdminLoginuseCase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class AdminController {
  constructor(private adminLoginuseCase: AdminLoginuseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.adminLoginuseCase.execute({ email, password });

    
      if (result.admin.role !== "admin") {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Only admins are allowed to log in here.",
        });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, ...result });
    } catch (error) {
      const err = error as Error;
      console.error("Admin Login Error:", err.message);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: err.message });
    }
  }
}
