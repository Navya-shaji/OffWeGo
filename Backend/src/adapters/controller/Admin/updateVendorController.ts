import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IUpdateVendorStatusUseCase } from "../../../domain/interface/admin/IUpdateVendorstatusUseCase";

export class UpdateVendorstatusController {
  constructor(private updateVendorstatususecase: IUpdateVendorStatusUseCase) {}

  async VendorStatusController(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.id.toString().trim();
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid status value. Must be 'approved' or 'rejected'.",
        });
        return;
      }

      const updated = await this.updateVendorstatususecase.executeById(
        vendorId,
        status
      );

      if (updated) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: `Vendor ${status} successfully`,
          data: updated,
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Vendor not found",
        });
      }
    } catch (error) {
      console.error("Error updating vendor status:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong while updating vendor status",
      });
    }
  }
}
