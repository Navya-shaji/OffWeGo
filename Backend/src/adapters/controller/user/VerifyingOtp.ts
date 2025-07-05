import { Request, Response } from "express";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class VerifyResetOtpController {
  constructor(private otpService: IOtpService) {}

  async verifyResetOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(req.body)

   if (!email || typeof email !== "string" || !otp || typeof otp !== "string") {

        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required and must be valid strings",
        });
        return;
      }

      const isVerified = await this.otpService.verifyOtp(email, otp);

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
}
