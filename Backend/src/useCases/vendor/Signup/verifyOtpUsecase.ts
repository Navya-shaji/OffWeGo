
import { IOtpService } from "../../../domain/interface/ServiceInterface/Iotpservice";

export class verifyOtpUsecase {
  constructor(
    private _otpService: IOtpService,
   
  ) {}

  async execute(email: string, otp: string): Promise<string> {
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (!isValid) throw new Error("Invalid OTP");

    return "OTP Verified successfully. Await admin approval.";
  }
}
