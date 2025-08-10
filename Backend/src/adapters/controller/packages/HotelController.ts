import { ICreateHotelUsecase } from "../../../domain/interface/vendor/IcreateHotelUsecase";
import { IgetHotelUsecase } from "../../../domain/interface/vendor/IgetHotelUsevase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class HotelController {
  constructor(private _createHotel: ICreateHotelUsecase,
    private _getHotels:IgetHotelUsecase
  ) {}

  async createHotels(req: Request, res: Response) {
    try {
      const hotelData = req.body;
      
      const result = await this._createHotel.execute(hotelData);
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
  async getHotels(req:Request,res:Response){
    try {
      const result=await this._getHotels.execute()
        res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Hotels fetched",
      });
    } catch (error) {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed fetch hotels",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
