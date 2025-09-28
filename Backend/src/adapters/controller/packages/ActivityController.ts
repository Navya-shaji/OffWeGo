import { IcreateActivityUsecase } from "../../../domain/interface/Vendor/IcreateactivityUsecase";
import { IdeleteActivity } from "../../../domain/interface/Vendor/IdeleteActivityUsecase";
import { IEditActivityUsecase } from "../../../domain/interface/Vendor/IeditActivityUsecase";
import { IGetAllActivities } from "../../../domain/interface/Vendor/IgetallActivitiesUsecase";
import { IsearchActivityUsecase } from "../../../domain/interface/Vendor/IsearchActivityUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class ActivityController {
  constructor(
    private _creatActivity: IcreateActivityUsecase,
    private _getallActivities: IGetAllActivities,
    private _editActivity: IEditActivityUsecase,
    private _deleteActivity: IdeleteActivity,
    private _searchActivity: IsearchActivityUsecase
  ) {}

  async createActivities(req: Request, res: Response) {
    const ActivityData = req.body;
    const result = await this._creatActivity.execute(ActivityData);
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
      message: "Activity created successfully",
    });
  }

  async getAllActivities(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const result = await this._getallActivities.execute(page, limit);
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
      message: "Activities fetched successfully",
    });
  }

  async editActivities(req: Request, res: Response) {
    const activityId = req.params.id;
    const activityData = req.body;
    const result = await this._editActivity.execute(activityId, activityData);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Activity updated successfully",
      data: result,
    });
  }

  async deleteActivity(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deleteActivity.execute(id);
    return res.status(HttpStatus.OK).json(result);
  }

  async SearchActivity(req: Request, res: Response) {
    const query = req.query.q;
    if (typeof query !== "string" || !query.trim()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "The query must be a string",
      });
      return;
    }
    const result = await this._searchActivity.execute(query);
    res.status(HttpStatus.OK).json({
      success: true,
      data: {
        activities: result,
        totalPages: 1,
        totalActivities: result.length,
        currentPage: 1,
      },
    });
  }
}
