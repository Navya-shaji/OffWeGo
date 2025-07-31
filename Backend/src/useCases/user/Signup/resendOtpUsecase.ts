import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
export class ResendOtpUsecase {
  constructor(private otpService: IOtpService) {}

  async execute(email: string): Promise<void> {
    const resendOtp= await this.otpService.resendOtp(email);
    return resendOtp
  }
}
