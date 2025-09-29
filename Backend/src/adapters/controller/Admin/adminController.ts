import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IAdminLoginUseCase } from "../../../domain/interface/Admin/IAdminUsecase";
import { AppError } from "../../../domain/errors/AppEroor";

export class AdminController {
  constructor(private _adminLoginuseCase: IAdminLoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await this._adminLoginuseCase.execute({ email, password });
    if (result.admin.role !== "admin") {
      throw new AppError(
        "Only admins are allowed to log in here.",
        HttpStatus.FORBIDDEN
      );
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
  }
}
