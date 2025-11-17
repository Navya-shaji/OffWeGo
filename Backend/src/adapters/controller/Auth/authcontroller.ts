import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../useCases/auth/refreshtokenusecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class RefreshTokenController {
  constructor(private _refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Refresh token is required",
        });
        return;
      }

      const tokens = await this._refreshTokenUseCase.execute(refreshToken);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Token refreshed successfully",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to refresh token",
        error,
      });
    }
  }
}
