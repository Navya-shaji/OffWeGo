import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBuddyTravelUseCase } from "../../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";
import { IAdminBuddyPackageApprovalUseCase } from "../../../domain/interface/BuddyTravel/IBuddyPackageApprovalUsecase";
import { IBuddyPackageApprovalUsecase } from "../../../domain/interface/BuddyTravel/IGetPendingBuddyPAckagesUsecase";
import { IGetVendorBuddyPackageUasecase } from "../../../domain/interface/BuddyTravel/IGetVendorBuddyPackageusecase";
import { IGetAllBuddyPackageUsecase } from "../../../domain/interface/BuddyTravel/IgetAllBuddypackageUsecase";

export class BuddyTravelController {
  constructor(
    private _createBuddyTravel: ICreateBuddyTravelUseCase,
    private _updateTravelUsecase: IAdminBuddyPackageApprovalUseCase,
    private _getTravelusecase: IBuddyPackageApprovalUsecase,
    private _getVendorBuddyPackages: IGetVendorBuddyPackageUasecase,
    private _getallBuddyPackages: IGetAllBuddyPackageUsecase
  ) {}

  async createBuddyTravel(req: Request, res: Response) {
    try {
      console.log(req.body);
      const result = await this._createBuddyTravel.execute(req.body);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Buddy travel package created successfully",
        data: result,
      });
    } catch (error) {
      console.error(" Error in createBuddyTravel:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async updateBuddyPackageStatus(req: Request, res: Response): Promise<void> {
    try {
      const buddyId = req.params.id?.trim();
      const { status } = req.body;
      console.log(status);
      if (!buddyId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Buddy travel ID is required",
        });
        return;
      }

      if (!["approve", "reject"].includes(status)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid status. Must be 'approve' or 'reject'.",
        });
        return;
      }

      const result = await this._updateTravelUsecase.execute(status, buddyId);

      if (!result) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Buddy travel not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message:
          status === "approve"
            ? "Buddy travel approved successfully"
            : "Buddy travel rejected successfully",
        data: result,
      });
    } catch (error) {
      console.error(" Error in updateBuddyPackageStatus:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getBuddyTravelPackages(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;

      const filterStatus = status ? (status as string) : undefined;
      const action = filterStatus ?? "pending";
      const result = await this._getTravelusecase.execute(action);

      console.log(result, "Fetched Buddy Travel Packages");

      if (!result || (Array.isArray(result) && result.length === 0)) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "No buddy travel packages found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Buddy travel packages fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getBuddyTravelPackages:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
  async getVendorBuddyPackages(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.params.id;
      const result = await this._getVendorBuddyPackages.execute(vendorId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Buddy packages fetched",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getAllbuddyPackages(req: Request, res: Response): Promise<void> {
    try {
  
      const result = await this._getallBuddyPackages.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Buddy packages fetches",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
