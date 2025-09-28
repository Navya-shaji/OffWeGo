import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVendorStatusCheckUseCase } from "../../../domain/interface/Vendor/IVendorStatusCheckUseCase";

export class VendorStatusCheckController {
  constructor(private _vendorStatusCheckUseCase: IVendorStatusCheckUseCase) {}

  async checkStatus(req: Request, res: Response): Promise<void> {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email query parameter is required",
      });
      return;
    }
    const vendor = await this._vendorStatusCheckUseCase.execute(email.trim());
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
  }
}
