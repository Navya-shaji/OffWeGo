import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetVendorByEmailUseCase } from "../../../domain/interface/Admin/IGetVendorByEmailUseCase";
import { IGetAllVendorsUseCase } from "../../../domain/interface/Admin/IGetAllVendorsUseCase";
import { IUpdateVendorStatusUseCase } from "../../../domain/interface/Admin/IUpdateVendorstatusUseCase";
import { IUpdateVendorUsecase } from "../../../domain/interface/Admin/IUpdateVendorUsecase";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { ISearchVendorUSecase } from "../../../domain/interface/Admin/ISearchVendorUseCase";

export class AdminVendorController {
  constructor(
    private _getVendorByEmailUseCase: IGetVendorByEmailUseCase,
    private _getAllVendorsUseCase: IGetAllVendorsUseCase,
    private _updateVendorStatusUseCase: IUpdateVendorStatusUseCase,
    private _updateVendorUseCase: IUpdateVendorUsecase,
    private _vendorRepository: IVendorRepository,
    private _searchvendorusecase: ISearchVendorUSecase
  ) {}

  async getVendorByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.query.email?.toString().toLowerCase().trim();
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Email is required",
        });
        return;
      }
      const vendor = await this._getVendorByEmailUseCase.execute(email);
      if (!vendor) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Vendor not found",
        });
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        vendor,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:  "Failed to fetch vendor by email",
        error
      });
    }
  }

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { vendors, totalvendors } = await this._getAllVendorsUseCase.execute(page, limit);
      res.status(HttpStatus.OK).json({
        success: true,
        vendors,
        totalvendors,
        page,
        totalPages: Math.ceil(totalvendors / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch vendors",
        error
      });
    }
  }

  async getVendorsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = req.params.status as "pending" | "approved" | "rejected";
      const vendors = await this._vendorRepository.findByStatus(status);
      res.status(HttpStatus.OK).json({
        success: true,
        vendors,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:  "Failed to fetch vendors by status",
        error
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
      const updated = await this._updateVendorStatusUseCase.executeById(vendorId, status);
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
        message: "Failed to update vendor approval status",
        error
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
          message: "isBlocked must be a boolean",
        });
        return;
      }
      await this._updateVendorUseCase.execute(vendorId, isBlocked);
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Vendor has been ${isBlocked ? "blocked" : "unblocked"} successfully.`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to block/unblock vendor",
        error
      });
    }
  }

  async searchVendor(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q;
      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "The query must be a non-empty string",
        });
        return;
      }
      const vendor = await this._searchvendorusecase.execute(query);
      res.status(HttpStatus.OK).json({
        success: true,
        data: vendor,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search vendor",
        error
      });
    }
  }
}
