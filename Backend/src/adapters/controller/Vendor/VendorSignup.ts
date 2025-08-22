import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";
import cloudinary from "../../../utilities/cloud";
import { IRegisterVendorUseCase } from "../../../domain/interface/vendor/IVendorUsecase";

export class VendorSignupController {
  constructor(private _RegistervendorUsecase: IRegisterVendorUseCase) {}

  async VendorSignup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password, confirmPassword, document } = req.body;

      if (!name || !email || !phone || !password || !confirmPassword || !document) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "All fields are required, including document",
        });
        return;
      }

const result = await cloudinary.uploader.upload(document, {
  folder: "vendor_documents",
});

      const documentUrl = result.secure_url;

      const vendorData: RegistervendorDto = {
        name,
        email,
        phone,
        password,
        documentUrl,
        
      };

      const newVendor = await this._RegistervendorUsecase.execute(vendorData);

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
      console.error("Error in VendorSignup:", err.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Vendor registration failed",
      });
    }
  }
}
