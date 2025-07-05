import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase"; 
import { Request,Response } from "express";


export class VendorSignupController{
    constructor(private RegistervendorUsecase:VendorRegisterUseCase){}

    async VendorSignup(req:Request,res:Response):Promise<void>{
        try {
            const formData:RegistervendorDto=req.body

            if(!formData.email || !formData.name || !formData.documentUrl || !formData.password || !formData.phone){
                res.status(HttpStatus.BAD_REQUEST).json({
                    success:false,
                    message:"All fields are required"
                })
                return 
            }

            const otpSent=await this.RegistervendorUsecase.execute(formData)

            res.status(HttpStatus.CREATED).json({
                success:true,
                message:"OTP Sent to your email address",
                data:{
                    email:formData.email,
                    vendorName:formData.name,
                    vendorPhone:formData.phone,
                    vendordoc:formData.documentUrl
                }
            })
        } catch (error) {
      console.error("Registration error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Registration failed",
      });
    }
}}