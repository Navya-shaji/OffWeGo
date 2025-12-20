import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";
import { IRegisterVendorUseCase } from "../../../domain/interface/Vendor/IVendorUsecase";

export class VendorSignupController {
  constructor(private _registerVendorUsecase: IRegisterVendorUseCase) {}

  async VendorSignup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password, confirmPassword, document } =
        req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword ||
        !document
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "All fields are required, including document",
        });
        return;
      }

      const vendorData: RegistervendorDto = {
        name,
        email,
        phone,
        password,
        documentUrl: document,
      };

      const newVendor = await this._registerVendorUsecase.execute(vendorData);

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
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Vendor registration failed",
        error,
      });
    }
  }
}
