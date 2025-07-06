import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase"; 
import { Request,Response } from "express";


export class VendorSignupController{
    constructor(private RegistervendorUsecase:VendorRegisterUseCase){}

  async VendorSignup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;
      const file = req.file;

      if (!name || !email || !phone || !password || !confirmPassword || !file) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
      }

      // You can store document URL or path in DB
      const documentUrl = `/uploads/${file.filename}`;

      // Forward data to use case or DB logic
      res.status(201).json({
        success: true,
        message: "Vendor registered successfully",
        data: {
          name,
          email,
          phone,
          documentUrl,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  }
}