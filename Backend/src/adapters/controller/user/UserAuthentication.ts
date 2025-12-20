import { Request, Response } from "express";
import { RegisterDTO } from "../../../domain/dto/User/RegisterDto";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVerifyOtpUseCase } from "../../../domain/interface/UsecaseInterface/IVerifyOtpUseCase";
import { IResendOtpUsecase } from "../../../domain/interface/UserRepository/IResendOtpUsecase";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";
import { IregisterUserUseCase } from "../../../domain/interface/UsecaseInterface/IusecaseInterface";
import { Role } from "../../../domain/constants/Roles";

export class UserRegisterController {
  constructor(
    private _registerUserUsecase: IregisterUserUseCase,
    private _verifyOtpUsecase: IVerifyOtpUseCase,
    private _resendOtpUsecase: IResendOtpUsecase,
    private _tokenService: ITokenService
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const formData: RegisterDTO = req.body;
      const otpSent = await this._registerUserUsecase.execute(formData);

      if (!otpSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        });
        return;
      }

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "OTP sent to your email address",
        data: {
          email: formData.email,
          username: formData.name,
        },
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "User registration failed",
        error,
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { userData, otp } = req.body;
      const verifiedUser = await this._verifyOtpUsecase.execute(userData, otp);

      const payload = {
        id: verifiedUser._id,
        email: verifiedUser.email,
        role: Role.USER,
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
        message: "OTP verified successfully",
        accessToken,
        user: verifiedUser,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid OTP or verification failed",
        error,
      });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this._resendOtpUsecase.execute(email);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP resent successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to resend OTP",
        error,
      });
    }
  }
}
