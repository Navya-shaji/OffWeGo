import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IVerifyOtpUseCase } from "../../../domain/interface/usecaseInterface/IVerifyOtpUseCase";

export class UserVerifyOtpController {
  constructor(private verifyOtpUseCase: IVerifyOtpUseCase) {}

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

      const verifiedUser = await this.verifyOtpUseCase.execute(userData, otp);

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
}
