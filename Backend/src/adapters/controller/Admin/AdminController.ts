import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IAdminLoginUseCase } from "../../../domain/interface/Admin/IAdminUsecase";
import { AppError } from "../../../domain/errors/AppError";

export class AdminController {
  constructor(private _adminLoginuseCase: IAdminLoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._adminLoginuseCase.execute({ email, password });

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
      console.error("Admin login error:", error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Something went wrong during admin login.",
        });
      }
    }
  }
}
