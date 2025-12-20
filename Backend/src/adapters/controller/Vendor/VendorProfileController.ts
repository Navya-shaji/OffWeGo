import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVendorProfileUseCase } from "../../../domain/interface/Vendor/IvendorProfileUsecase";
import { IVendorProfileEditUsecase } from "../../../domain/interface/Vendor/IVendorProfileEditUsecase";

export class VendorProfileController {
  constructor(
    private _getVendorProfileUsecase: IVendorProfileUseCase,
    private _editVendorProfileUsecase: IVendorProfileEditUsecase
  ) {}

  async GetProfile(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.query;

      if (typeof email !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required and must be a string",
        });
        return;
      }

      const result = await this._getVendorProfileUsecase.execute(email);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Profile not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Profile fetched successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch vendor profile",
        error,
      });
    }
  }

  async EditProfile(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.id;
      const vendorData = req.body;

      const result = await this._editVendorProfileUsecase.execute(
        vendorId,
        vendorData
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Vendor profile updated successfully",
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update vendor profile",
        error,
      });
    }
  }
}
