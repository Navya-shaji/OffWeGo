import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";

export class VendorAuthStatusController {
  constructor(private _vendorRepository: IVendorRepository) {}

  async getAuthVendorStatus(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as any).vendor?.id;
      
      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor not authenticated",
        });
        return;
      }

      const vendor = await this._vendorRepository.findById(vendorId);
      
      if (!vendor) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Vendor not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          status: vendor.status,
          rejectionReason: vendor.rejectionReason || "",
          name: vendor.name,
          email: vendor.email,
          submittedAt: vendor.createdAt,
        },
      });
    } catch (error) {
      console.error("Error fetching vendor status:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
