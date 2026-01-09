import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../useCases/auth/refreshtokenusecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { success } from "../../../domain/constants/Success";
import { ErrorMessages } from "../../../domain/constants/Error";
import { AppError } from "../../../domain/errors/AppError";

export class RefreshTokenController {
  constructor(private _refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.TOKEN_MISSING,
        });
        return;
      }

      const tokens = await this._refreshTokenUseCase.execute(refreshToken);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.TOKEN_REFRESHED,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
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
