import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase";
import { Request, Response } from "express";

export class VendorSignupController {
  constructor(private RegistervendorUsecase: VendorRegisterUseCase) {}

  async VendorSignup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;
      const file = req.file;

      if (!name || !email || !phone || !password || !confirmPassword || !file) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "All fields are required" });
        return;
      }

      const documentUrl = `/uploads/${file.filename}`;

      const vendorData: RegistervendorDto = {
        name,
        email,
        phone,
        password,
        documentUrl,
      };

      const newVendor = await this.RegistervendorUsecase.execute(vendorData);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Vendor registered successfully. OTP sent to email.",
        data: {
          name: newVendor.name,
          email: newVendor.email,
          phone: newVendor.phone,
          documentUrl: newVendor.documentUrl,
        },
      });
    } catch (err: any) {
      console.error(" Error in VendorSignup:", err.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: err.message || "Registration failed" });
    }
  }
}
