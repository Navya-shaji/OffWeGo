import { IcreateActivityUsecase } from "../../../domain/interface/vendor/IcreateactivityUsecase";
import { IGetAllActivities } from "../../../domain/interface/vendor/IgetallActivitiesUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class ActivityController {
  constructor(
    private _creatActivity: IcreateActivityUsecase,
    private _getallActivities: IGetAllActivities
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
      console.log("result",result)
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
}
