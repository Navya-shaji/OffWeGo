import { IcreateActivityUsecase } from "../../../domain/interface/vendor/IcreateactivityUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class ActivityController {
  constructor(private creatActivity: IcreateActivityUsecase) {}

  async createActivities(req: Request, res: Response) {
    try {
      const ActivityData = req.body;
      const result = await this.creatActivity.execute(ActivityData);
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
}
