import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../useCases/auth/Refreshtokenusecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";

export class RefreshTokenController {
  private _refreshTokenUseCase: RefreshTokenUseCase;

  constructor(refreshTokenUseCase: RefreshTokenUseCase) {
    this._refreshTokenUseCase = refreshTokenUseCase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Refresh token is required" });
        return;
      }

      const tokens = await this._refreshTokenUseCase.execute(refreshToken);

      res.status(HttpStatus.OK).json({
        message: "Token refreshed successfully",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error: any) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message || "Invalid refresh token" });
    }
  }
}
