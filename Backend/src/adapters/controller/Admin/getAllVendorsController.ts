

import { Request, Response } from "express";
import { GetAllVendorsUseCase } from "../../../useCases/admin/Vendor/getAllVendorsUsecase"; 
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class AdminGetAllVendorController {
  constructor(private getAllVendorsUseCase: GetAllVendorsUseCase) {}

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const vendors = await this.getAllVendorsUseCase.execute();
      res.status(HttpStatus.OK).json({ success: true, vendors });
    } catch (err) {
      const error = err as Error;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
