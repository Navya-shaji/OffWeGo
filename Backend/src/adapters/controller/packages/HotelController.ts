import { ICreateHotelUsecase } from "../../../domain/interface/vendor/IcreateHotelUsecase";
import { IDeleteHotelUsecase } from "../../../domain/interface/vendor/IdeleteHotelusecase";
import { IEditHotelUsecase } from "../../../domain/interface/vendor/IEdithotelusecase";
import { IgetHotelUsecase } from "../../../domain/interface/vendor/IgetHotelUsevase";
import { ISearchHotelUsecase } from "../../../domain/interface/vendor/IhotelSearchusecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class HotelController {
  constructor(
    private _createHotel: ICreateHotelUsecase,
    private _getHotels: IgetHotelUsecase,
    private _editHotels: IEditHotelUsecase,
    private _deleteHotel: IDeleteHotelUsecase,
    private _searchHotel: ISearchHotelUsecase
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
  async getHotels(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this._getHotels.execute(page, limit);
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
  async editHotel(req: Request, res: Response) {
    try {
      const HotelId = req.params.id;
      const hotelData = req.body;
      const result = await this._editHotels.execute(HotelId, hotelData);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Hotel updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update Hotel",
      });
    }
  }
  async deleteHotel(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await this._deleteHotel.execute(id);
     
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to delete Activity" });
    }
  }
  async SearchHotel(req: Request, res: Response) {
    try {
      const query = req.query.q;
      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "The query will be string",
        });
        return;
      }
      const hotels = await this._searchHotel.execute(query);
      res.json({ success: true, data: hotels });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
