import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../useCases/auth/refreshtokenusecase"; 
import { HttpStatus } from "../../../domain/statusCode/statuscode";
export class RefreshTokenController {
  private refreshTokenUseCase: RefreshTokenUseCase;

  constructor(refreshTokenUseCase: RefreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      
      const { refreshToken } = req.cookies;
   

      if (!refreshToken) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Refresh token is required" });
        return;
      }

      const tokens = await this.refreshTokenUseCase.execute(refreshToken);

      res.status(HttpStatus.OK).json({
        message: "Token refreshed successfully",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error: any) {
      
      res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message || "Invalid refresh token" });
    }
  }
}
