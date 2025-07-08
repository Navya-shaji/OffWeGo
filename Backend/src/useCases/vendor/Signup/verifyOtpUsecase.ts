
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";

export class verifyOtpUsecase {
  constructor(
    private otpService: IOtpService,
   
  ) {}

  async execute(email: string, otp: string): Promise<string> {
    const isValid = await this.otpService.verifyOtp(email, otp);
    if (!isValid) throw new Error("Invalid OTP");

    return "OTP Verified successfully. Await admin approval.";
  }
}
