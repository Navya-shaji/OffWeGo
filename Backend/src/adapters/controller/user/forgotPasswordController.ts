import { Request, Response } from "express";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class forgotPasswordController {
  constructor(private otpService: IOtpService) {}
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
      const otp = this.otpService.generateOtp();
      await this.otpService.storeOtp(email, otp);
      await this.otpService.sendOtpEmail(email, otp);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "OTP send to your email for reset" });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to send OTP" });
    }
  }
}
