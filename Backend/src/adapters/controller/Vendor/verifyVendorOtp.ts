import { Request, Response } from "express";
import { verifyOtpUsecase } from "../../../useCases/vendor/Signup/verifyOtpUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class VendorVerifyOtpController {
  constructor(private vendorVerifyOtpUseCase: verifyOtpUsecase) {}

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email and OTP are required",
        });
        return;
      }

      const verifiedVendor = await this.vendorVerifyOtpUseCase.execute(
        email,
        otp
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "OTP verified successfully",
        data: verifiedVendor,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Vendor OTP verification failed",
      });
    }
  }
}
