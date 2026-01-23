import { IcreateActivityUsecase } from "../../../domain/interface/Vendor/IcreateactivityUsecase";
import { IdeleteActivity } from "../../../domain/interface/Vendor/IdeleteActivityUsecase";
import { IEditActivityUsecase } from "../../../domain/interface/Vendor/IeditActivityUsecase";
import { IGetAllActivities } from "../../../domain/interface/Vendor/IgetallActivitiesUsecase";
import { IsearchActivityUsecase } from "../../../domain/interface/Vendor/IsearchActivityUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class ActivityController {
  constructor(
    private _createActivityUsecase: IcreateActivityUsecase,
    private _getAllActivitiesUsecase: IGetAllActivities,
    private _editActivityUsecase: IEditActivityUsecase,
    private _deleteActivityUsecase: IdeleteActivity,
    private _searchActivityUsecase: IsearchActivityUsecase
  ) { }

  async createActivities(req: Request, res: Response) {
    try {
      const packageId = req.params.packageId;
      const activityData = req.body;

      const result = await this._createActivityUsecase.execute(
        activityData,
        packageId
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Activity created successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getAllActivities(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this._getAllActivitiesUsecase.execute(page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Activities fetched successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async editActivities(req: Request, res: Response) {
    try {
      const activityId = req.params.activityId;
      const activityData = req.body;

      const result = await this._editActivityUsecase.execute(
        activityId,
        activityData
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Activity updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const { activityId } = req.params;

      const result = await this._deleteActivityUsecase.execute(activityId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Activity deleted successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async SearchActivity(req: Request, res: Response) {
    try {
      const query = req.query.q as string;

      const result = await this._searchActivityUsecase.execute(query);

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          activities: result,
          totalPages: 1,
          totalActivities: result.length,
          currentPage: 1,
        },
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
