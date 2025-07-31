import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IResendOtpUsecase } from "../../../domain/interface/userRepository/IResendOtpUsecase"; 

export class ResendOtpController {
  constructor(private resendOtpUseCase: IResendOtpUsecase) {}

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

      const result = await this.resendOtpUseCase.execute(email);

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
