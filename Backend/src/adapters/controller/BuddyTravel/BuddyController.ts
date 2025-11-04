import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBuddyTravelUseCase } from "../../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";
import { IAdminBuddyPackageApprovalUseCase } from "../../../domain/interface/BuddyTravel/IBuddyPackageApprovalUsecase";

export class BuddyTravelController {
  constructor(private _createBuddyTravel: ICreateBuddyTravelUseCase,
    private _updateTravelUsecase:IAdminBuddyPackageApprovalUseCase
  ) {}

  async createBuddyTravel(req: Request, res: Response) {
    try {
      console.log(req.body)
      const result = await this._createBuddyTravel.execute(req.body);
    
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Buddy travel package created successfully",
        data: result,
      });
    } catch (error) {
       console.error("❌ Error in createBuddyTravel:", error);
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

      const result = await this._updateTravelUsecase.execute(status,buddyId);

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
      console.error("❌ Error in updateBuddyPackageStatus:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
