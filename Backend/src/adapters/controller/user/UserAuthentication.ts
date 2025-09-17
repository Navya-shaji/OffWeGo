import { Request, Response } from "express";
import { RegisterDTO } from "../../../domain/dto/user/userDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IregisterUserUseCase } from "../../../domain/interface/usecaseInterface/IusecaseInterface";
import { IVerifyOtpUseCase } from "../../../domain/interface/usecaseInterface/IVerifyOtpUseCase";
import { IResendOtpUsecase } from "../../../domain/interface/userRepository/IResendOtpUsecase";

export class UserRegisterController {
  constructor(
    private _registerUserUseCase: IregisterUserUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _resendOtpUseCase: IResendOtpUsecase
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const formData: RegisterDTO = req.body;

      if (!formData.email || !formData.password || !formData.name) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email, password and name are required",
        });
        return;
      }

      const otpSent = await this._registerUserUseCase.execute(formData);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "OTP sent to your email address",
        data: {
          email: formData.email,
          username: formData.name,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Registration failed",
      });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { userData, otp } = req.body;

      if (!otp || !userData?.email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required",
        });
        return;
      }

      const verifiedUser = await this._verifyOtpUseCase.execute(userData, otp);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP verified successfully",
        data: verifiedUser,
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "OTP verification failed",
      });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required to resend OTP",
        });
        return;
      }

      const result = await this._resendOtpUseCase.execute(email);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP resent successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      res.status(error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error?.message || "Failed to resend OTP",
      });
    }
  }
}
