import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IUserLoginUseCase } from "../../../domain/interface/UsecaseInterface/ILoginUserUseCaseInterface";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
import { IOtpService } from "../../../domain/interface/ServiceInterface/Iotpservice";
import { IResetPasswordUseCase } from "../../../domain/interface/UsecaseInterface/IResetPasswordUseCase";
import { IForgotpassUsecase } from "../../../domain/interface/UserLogin/IForgotPassUSecase";

export class UserLoginController {
  constructor(
    private _loginUserUseCase: IUserLoginUseCase,
    private _tokenService: ITokenService,
    private _otpService: IOtpService,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _forgotPassUsecase: IForgotpassUsecase
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
          message: "Admins cannot log in from the user portal",
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
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid credentials",
        error
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
        return;
      }

      await this._forgotPassUsecase.execute(email);
      const otp = this._otpService.generateOtp();
      await this._otpService.storeOtp(email, otp);
      await this._otpService.sendOtpEmail(email, otp);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP sent to your email for password reset",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to send OTP. Please try again later.",
        error
      });
    }
  }

  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required",
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "OTP verification failed. Please try again.",
        error
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and new password are required",
        });
        return;
      }

      await this._resetPasswordUseCase.execute(email, newPassword);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Password reset failed. Please try again later.",
        error
      });
    }
  }
}
