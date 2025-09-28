import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVerifyOtpVendorUsecase } from "../../../domain/interface/Vendor/IVerifyOtpVendorUseCase";

export class VendorVerifyOtpController {
  constructor(private _vendorVerifyOtpUseCase: IVerifyOtpVendorUsecase) {}

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }
    const verifiedVendor = await this._vendorVerifyOtpUseCase.execute(
      email,
      otp
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: "OTP verified successfully",
      data: verifiedVendor,
    });
  }
}
