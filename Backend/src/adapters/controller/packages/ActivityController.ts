import { IcreateActivityUsecase } from "../../../domain/interface/vendor/IcreateactivityUsecase";
import { IdeleteActivity } from "../../../domain/interface/vendor/IdeleteActivityUsecase";
import { IEditActivityUsecase } from "../../../domain/interface/vendor/IeditActivityUsecase";
import { IGetAllActivities } from "../../../domain/interface/vendor/IgetallActivitiesUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, response, Response } from "express";

export class ActivityController {
  constructor(
    private _creatActivity: IcreateActivityUsecase,
    private _getallActivities: IGetAllActivities,
    private _editActivity: IEditActivityUsecase,
    private _deleteActivity: IdeleteActivity
  ) {}

  async createActivities(req: Request, res: Response) {
    try {
      const ActivityData = req.body;
      const result = await this._creatActivity.execute(ActivityData);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Activity created successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create Activity",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  async getAllActivities(req: Request, res: Response) {
    try {
      const result = await this._getallActivities.execute();
      console.log("result", result);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Activities fetched successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create Activity",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  async editActivities(req: Request, res: Response) {
    try {
      const activityId = req.params.id;
      const activityData = req.body;

      const result = await this._editActivity.execute(activityId, activityData);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Activity updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update Activity",
      });
    }
  }
  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this._deleteActivity.execute(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to delete Activity" });
    }
  }
}
