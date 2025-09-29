import { ICreateHotelUsecase } from "../../../domain/interface/Vendor/IcreateHotelUsecase";
import { IDeleteHotelUsecase } from "../../../domain/interface/Vendor/IdeleteHotelusecase";
import { IEditHotelUsecase } from "../../../domain/interface/Vendor/IEdithotelusecase";
import { IgetHotelUsecase } from "../../../domain/interface/Vendor/IgetHotelUsevase";
import { ISearchHotelUsecase } from "../../../domain/interface/Vendor/IhotelSearchusecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
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
    const hotelData = req.body;
    const result = await this._createHotel.execute(hotelData);
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
      message: "Hotel created successfully",
    });
  }

  async getHotels(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const result = await this._getHotels.execute(page, limit);
    res.status(HttpStatus.OK).json({
      success: true,
      data: result,
      message: "Hotels fetched",
    });
  }

  async editHotel(req: Request, res: Response) {
    const HotelId = req.params.id;
    const hotelData = req.body;
    const result = await this._editHotels.execute(HotelId, hotelData);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Hotel updated successfully",
      data: result,
    });
  }

  async deleteHotel(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deleteHotel.execute(id);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Hotel deleted successfully",
      data: result,
    });
  }

  async SearchHotel(req: Request, res: Response) {
    const query = req.query.q;
    if (typeof query !== "string" || !query.trim()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "The query will be string",
      });
      return;
    }
    const hotels = await this._searchHotel.execute(query);
    res.json({ success: true, data: hotels });
  }
}
