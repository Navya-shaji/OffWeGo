import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGoogleSignupUseCase } from "../../../domain/interface/usecaseInterface/IgoogleSignupUsecase";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";

export class GoogleSignupController {
  constructor(
    private googleSigninUseCase: IGoogleSignupUseCase,
    private tokenService: ITokenService
  ) {}

  async googleSignin(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Google token is required",
        });
        return;
      }

      const user = await this.googleSigninUseCase.execute(token);

      if (user.status?.toLowerCase().includes("block")) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Your account has been blocked by the admin",
        });
        return;
      }

      const payload = { userId: user._id, role: user.role };
      const accessToken = this.tokenService.generateAccessToken(payload);
      const refreshToken = this.tokenService.generateRefreshToken(payload);

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
      const err = error as Error;
      console.error("Google signin failed:", err);
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: err.message || "Google signin failed",
      });
    }
  }
}
