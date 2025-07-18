import { Request, Response } from "express";
import { GetVendorByEmailUseCase } from "../../../useCases/admin/Vendor/getVendorByEmailUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class AdminVendorController {
  constructor(private getVendorByEmailUsecase: GetVendorByEmailUseCase) {}

  async getvendorByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email.toLowerCase().trim(); 
      const vendor = await this.getVendorByEmailUsecase.execute(email);
      if (!vendor) {
        console.log("No vendor")
        res.status(404).json({ success: false, message: "Vendor not found" });
        return;
      }
      const { password, ...safeVendor } = vendor;
      res.status(200).json({ success: true, vendor: safeVendor });
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: err.message,
      });
    }
  }
}
