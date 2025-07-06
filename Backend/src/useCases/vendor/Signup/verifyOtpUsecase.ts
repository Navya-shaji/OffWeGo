import { emit } from "process";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class verifyOtpUsecase{
    constructor(
        private otpService:IOtpService,
        private vendorReository:IVendorRepository
    ){}

    async execute(email:string,otp:string):Promise<string>{
        const isValid=await this.otpService.verifyOtp(email,otp);
        if(!isValid) throw new Error("Invalid OTP")

            await this.vendorReository.updateStatus(email,"Otp_Verified")
            return "OTP Verified successsfully .Await admin Approval"
    }

}