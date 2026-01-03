import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IAdminLoginUseCase } from "../../../domain/interface/Admin/IAdminUsecase";
import { AppError } from "../../../domain/errors/AppError";
import { success } from "../../../domain/constants/Success";
import { ErrorMessages } from "../../../domain/constants/Error";

export class AdminController {
  constructor(private _adminLoginUseCase: IAdminLoginUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this._adminLoginUseCase.execute({
        email,
        password,
      });

      const refreshTokenMaxAge = process.env.MAX_AGE
        ? Number(process.env.MAX_AGE)
        : 7 * 24 * 60 * 60 * 1000;

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.LOGGED_IN,
        accessToken: result.accessToken,
        admin: result.admin,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.LOGGED_OUT,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
