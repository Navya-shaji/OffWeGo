import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGetVendorByEmailUseCase } from "../../../domain/interface/admin/IGetVendorByEmailUseCase";
import { IGetAllVendorsUseCase } from "../../../domain/interface/admin/IGetAllVendorsUseCase";
import { IUpdateVendorStatusUseCase } from "../../../domain/interface/admin/IUpdateVendorstatusUseCase";
import { IUpdateVendorUsecase } from "../../../domain/interface/admin/IUpdateVendorUsecase";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";

export class AdminVendorController {
  constructor(
    private getVendorByEmailUseCase: IGetVendorByEmailUseCase,
    private getAllVendorsUseCase: IGetAllVendorsUseCase,
    private updateVendorStatusUseCase: IUpdateVendorStatusUseCase,
    private updateVendorUseCase: IUpdateVendorUsecase,
    private vendorRepository: IVendorRepository
  ) {}

  async getVendorByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email.toLowerCase().trim();
      const vendor = await this.getVendorByEmailUseCase.execute(email);

      if (!vendor) {
        res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Vendor not found" });
        return;
      }

      const { password, ...safeVendor } = vendor;
      res.status(HttpStatus.OK).json({ success: true, vendor: safeVendor });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const vendors = await this.getAllVendorsUseCase.execute();
      res.status(HttpStatus.OK).json({ success: true, vendors });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

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

  async updateVendorApprovalStatus(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.id.trim();
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid status value. Must be 'approved' or 'rejected'.",
        });
        return;
      }

      const updated = await this.updateVendorStatusUseCase.executeById(vendorId, status);

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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong while updating vendor status",
      });
    }
  }

  async blockOrUnblockVendor(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.id;
      const { isBlocked } = req.body;

      if (typeof isBlocked !== "boolean") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "`isBlocked` must be a boolean (true or false)",
        });
        return;
      }

      await this.updateVendorUseCase.execute(vendorId, isBlocked);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Vendor has been ${isBlocked ? "blocked" : "unblocked"} successfully.`,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
