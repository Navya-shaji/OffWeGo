import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVendorProfileUseCase } from "../../../domain/interface/Vendor/IvendorProfileUsecase";
import { IVendorProfileEditUsecase } from "../../../domain/interface/Vendor/IVendorProfileEditUsecase";

export class VendorProfileController {
  constructor(
    private _vendorprofileusecase: IVendorProfileUseCase,
    private _editProfile: IVendorProfileEditUsecase
  ) {}

  async GetProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;
      if (typeof email !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "email is Required  and must be string",
        });
        return;
      }

      const result = await this._vendorprofileusecase.execute(email);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Profile fetched successfully",
          data: result,
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Profile not found",
        });
      }
    } catch (error) {
      console.error("Error in GetProfile:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  async EditProfile(req: Request, res: Response) {
    try {
      const VendorId = req.params.id;
      const VendorDataData = req.body;

      const result = await this._editProfile.execute(VendorId, VendorDataData);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Vendor Profile Updated successfully",
        data: {
          id: result?._id,
          name: result?.name,
          email: result?.email,
          phone: result?.phone,
          profileImage: result?.profileImage,
          document: result?.documentUrl,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }
}
