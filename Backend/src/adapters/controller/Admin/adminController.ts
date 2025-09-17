import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IAdminLoginUseCase } from "../../../domain/interface/Admin/IAdminUsecase";

export class AdminController {
  constructor(private _adminLoginuseCase: IAdminLoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._adminLoginuseCase.execute({ email, password });

      if (result.admin.role !== "admin") {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Only admins are allowed to log in here.",
        });
        return;
      }
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: process.env.MAX_AGE ? Number(process.env.MAX_AGE) : undefined,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        accessToken: result.accessToken,
        admin: result.admin,
      });
    } catch (error) {
      const err = error as Error;
      console.error("Admin Login Error:", err.message);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: err.message });
    }
  }
}
