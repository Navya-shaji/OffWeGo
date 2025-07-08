import { Request, Response } from "express";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class GetVendorsByStatusController {
  constructor(private vendorRepository: IVendorRepository) {}

  async getVendorsByStatus(req: Request, res: Response): Promise<void> {
    const status = req.params.status as "pending" | "approved" | "rejected";

    try {
      const vendors = await this.vendorRepository.findByStatus(status);
      res.status(HttpStatus.OK).json({ success: true, vendors });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error fetching vendors",
      });
    }
  }
}
