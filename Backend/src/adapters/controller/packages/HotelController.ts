import { ICreateHotelUsecase } from "../../../domain/interface/vendor/IcreateHotelUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class HotelController {
  constructor(private createHotel: ICreateHotelUsecase) {}

  async createHotels(req: Request, res: Response) {
    try {
      const hotelData = req.body;
      const result = await this.createHotel.execute(hotelData);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Hotel created successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create Hotel",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
