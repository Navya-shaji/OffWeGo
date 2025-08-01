import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IVendorStatusCheckUseCase } from "../../../domain/interface/vendor/IVendorStatusCheckUseCase";

export class VendorStatusCheckController {
  constructor(private vendorStatusCheckUseCase: IVendorStatusCheckUseCase) {}

  async checkStatus(req: Request, res: Response): Promise<void> {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email query parameter is required",
      });
      return;
    }

    try {
      const vendor = await this.vendorStatusCheckUseCase.execute(email.trim());

      if (!vendor) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Vendor not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        status: vendor.status,
      });
    } catch (error) {
      console.error("Error fetching vendor status:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error while checking vendor status",
      });
    }
  }
}
