import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGoogleSignupUseCase } from "../../../domain/interface/UsecaseInterface/IgoogleSignupUsecase";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";

export class GoogleSignupController {
  constructor(
    private _googleSignupUsecase: IGoogleSignupUseCase,
    private _tokenService: ITokenService
  ) {}

  async googleSignin(req: Request, res: Response): Promise<void> {
    try {
      const { token, fcmToken } = req.body;

      const user = await this._googleSignupUsecase.execute(token, fcmToken);

      if (!user || !user._id) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "User information is incomplete or missing.",
        });
        return;
      }

      const payload = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      };

      const accessToken = this._tokenService.generateAccessToken(payload);
      const refreshToken = this._tokenService.generateRefreshToken(payload);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: process.env.MAX_AGE ? Number(process.env.MAX_AGE) : undefined,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Signin successful",
        accessToken,
        user,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Google Signin failed",
        error,
      });
    }
  }
}
