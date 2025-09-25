import { Request, Response } from "express";
import { RegisterDTO } from "../../../domain/dto/user/RegisterDto"; 
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IregisterUserUseCase } from "../../../domain/interface/UsecaseInterface/IusecaseInterface";
import { IVerifyOtpUseCase } from "../../../domain/interface/UsecaseInterface/IVerifyOtpUseCase";
import { IResendOtpUsecase } from "../../../domain/interface/UserRepository/IResendOtpUsecase";
import { ITokenService } from "../../../domain/interface/ServiceInterface/ItokenService";

export class UserRegisterController {
  constructor(
    private _registerUserUseCase: IregisterUserUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _resendOtpUseCase: IResendOtpUsecase,
    private _tokenService: ITokenService // Added token service
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const formData: RegisterDTO = req.body;

    if (!formData.email || !formData.password || !formData.name) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email, password and name are required",
      });
      return;
    }

    // const otpSent = await this._registerUserUseCase.execute(formData);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "OTP sent to your email address",
      data: {
        email: formData.email,
        username: formData.name,
      },
    });
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { userData, otp } = req.body;

    if (!otp || !userData?.email) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }

    const verifiedUser = await this._verifyOtpUseCase.execute(userData, otp);
    

    // Generate JWT payload
    const payload = {
      id: verifiedUser._id,
      email: verifiedUser.email,
      role: verifiedUser.role || "user",
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
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
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
  }
}
