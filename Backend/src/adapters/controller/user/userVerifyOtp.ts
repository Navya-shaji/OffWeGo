import { Request, Response } from "express";
import { VerifyOtpUseCase } from "../../../useCases/user/Signup/VerifyOtpUseCase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";


export class UserVerifyOtpController {
 constructor(
    private verifyOtpUseCase: VerifyOtpUseCase
  ) {}

  async verifyOtp(req:Request,res:Response):Promise<void>{
        try {
            const {userData,otp} =req.body
            const isVerified=await this.verifyOtpUseCase.execute(userData,otp)
            res.status(HttpStatus.OK).json({
                success:true,
                messege:"OTP Verified Successfully"
            })
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({
                success:false,
                messege:"OTP verification failed"
            })
        }
  }
}
