import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBuddyTravelUseCase } from "../../../domain/interface/BuddyTravel/ICreateBuddytravelUSecase";

export class BuddyTravelController {
  constructor(private _createBuddyTravel: ICreateBuddyTravelUseCase) {}

  async createBuddyTravel(req: Request, res: Response) {
    try {
      const result = await this._createBuddyTravel.execute(req.body);
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Buddy travel package created successfully",
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
