import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";
import cloudinary from "../../../utilities/cloud";
import { IRegisterVendorUseCase } from "../../../domain/interface/Vendor/IVendorUsecase";

export class VendorSignupController {
  constructor(private _RegistervendorUsecase: IRegisterVendorUseCase) {}

  async VendorSignup(req: Request, res: Response): Promise<void> {
    console.log("vendor controller")
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

    // const result = await cloudinary.uploader.upload(document, {
    //   folder: "vendor_documents",
    // });

    const documentUrl = document;

    const vendorData: RegistervendorDto = {
      name,
      email,
      phone,
      password,
      documentUrl,
    };
    console.log("vendor usecase")
    
    const newVendor = await this._RegistervendorUsecase.execute(vendorData);
    console.log("vendor usecase completed")

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
  }
}
