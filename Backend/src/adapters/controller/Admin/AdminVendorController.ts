import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetVendorByEmailUseCase } from "../../../domain/interface/Admin/IGetVendorByEmailUseCase";
import { IGetAllVendorsUseCase } from "../../../domain/interface/Admin/IGetAllVendorsUseCase";
import { IUpdateVendorStatusUseCase } from "../../../domain/interface/Admin/IUpdateVendorstatusUseCase";
import { IUpdateVendorUsecase } from "../../../domain/interface/Admin/IUpdateVendorUsecase";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { ISearchVendorUSecase } from "../../../domain/interface/Admin/ISearchVendorUseCase";
import { success } from "../../../domain/constants/Success";
import { ErrorMessages } from "../../../domain/constants/Error";
import { AppError } from "../../../domain/errors/AppError";

export class AdminVendorController {
  constructor(
    private _getVendorByEmailUseCase: IGetVendorByEmailUseCase,
    private _getAllVendorsUseCase: IGetAllVendorsUseCase,
    private _updateVendorStatusUseCase: IUpdateVendorStatusUseCase,
    private _updateVendorUseCase: IUpdateVendorUsecase,
    private _vendorRepository: IVendorRepository,
    private _searchvendorusecase: ISearchVendorUSecase
  ) { }

  async getVendorByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.query.email?.toString().toLowerCase().trim();

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      const vendor = await this._getVendorByEmailUseCase.execute(email);

      if (!vendor) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: ErrorMessages.VENDOR_NOT_FOUND,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: vendor,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { vendors, totalvendors } =
        await this._getAllVendorsUseCase.execute(page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: vendors,
        totalVendors: totalvendors,
        currentPage: page,
        totalPages: Math.ceil(totalvendors / limit),
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getVendorsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = req.params.status as "pending" | "approved" | "rejected";

      const vendors = await this._vendorRepository.findByStatus(status);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: vendors,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateVendorApprovalStatus(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId?.trim();
      const { status, rejectionReason } = req.body;

      if (!vendorId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      if (!["approved", "rejected"].includes(status)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_STATUS,
        });
        return;
      }

      const updated = await this._updateVendorStatusUseCase.executeById(
        vendorId,
        status,
        rejectionReason
      );

      if (!updated) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: ErrorMessages.VENDOR_NOT_FOUND,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message:
          status === "approved"
            ? success.SUCCESS_MESSAGES.APPROVED
            : success.SUCCESS_MESSAGES.REJECTED,
        data: updated,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async blockOrUnblockVendor(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.vendorId?.trim();
      const { isBlocked } = req.body;

      if (!vendorId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      if (typeof isBlocked !== "boolean") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_REQUEST,
        });
        return;
      }

      await this._updateVendorUseCase.execute(vendorId, isBlocked);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.UPDATED,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async searchVendor(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q;

      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_REQUEST,
        });
        return;
      }

      const vendors = await this._searchvendorusecase.execute(query.trim());

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: vendors,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
