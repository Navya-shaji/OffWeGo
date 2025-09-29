import { IOtpService } from "../../../domain/interface/ServiceInterface/Iotpservice";
export class ResendOtpUsecase {
  constructor(private _otpService: IOtpService) {}

  async execute(email: string): Promise<void> {
    const resendOtp= await this._otpService.resendOtp(email);
    return resendOtp
  }
}
