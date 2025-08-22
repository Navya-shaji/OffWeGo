import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IUserLoginUseCase } from "../../../domain/interface/usecaseInterface/ILoginUserUseCaseInterface";
import { ITokenService } from "../../../domain/interface/serviceInterface/ItokenService";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { IResetPasswordUseCase } from "../../../domain/interface/usecaseInterface/IResetPasswordUseCase";

export class UserLoginController {
  constructor(
    private _loginUserUseCase: IUserLoginUseCase,
    private _tokenService: ITokenService,
    private _otpService: IOtpService,
    private _resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and password are required",
        });
        return;
      }

      const result = await this._loginUserUseCase.execute({ email, password });
      const user = result.user;

      if (user.role?.toLowerCase() === "admin") {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          message: "Admins are not allowed to log in from user portal",
        });
        return;
      }

      if (user.status?.toLowerCase().includes("block")) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          code: "USER_BLOCKED",
          message: "Your account has been blocked by the admin",
        });
        return;
      }

      const payload = { userId: user.id, role: user.role };
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
        message: "Login successful",
        accessToken,
        user,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error?.message || "Login failed",
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Provide a valid email",
        });
        return;
      }
      const otp = this._otpService.generateOtp();
      await this._otpService.storeOtp(email, otp);
      await this._otpService.sendOtpEmail(email, otp);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "OTP send to your email for reset" });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to send OTP" });
    }
  }

  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      

   if (!email || typeof email !== "string" || !otp || typeof otp !== "string") {

        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required and must be valid strings",
        });
        return;
      }

      const isVerified = await this._otpService.verifyOtp(email, otp);

      if (!isVerified) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid or expired OTP",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Error verifying reset OTP:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong while verifying OTP",
      });
    }
}

async resetPassword(req: Request, res: Response): Promise<void> {
    const { email, newPassword } = req.body;

    if (
      !email ||
      !newPassword ||
      typeof email !== "string" ||
      typeof newPassword !== "string"
    ) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message:
          "Email, OTP, and new password are required and must be valid strings",
      });
      return;
    }

    try {
      await this._resetPasswordUseCase.execute(email, newPassword);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message || "Password reset failed",
      });
    }
  }

}