import { ICreateHotelUsecase } from "../../../domain/interface/Vendor/IcreateHotelUsecase";
import { IDeleteHotelUsecase } from "../../../domain/interface/Vendor/IdeleteHotelusecase";
import { IEditHotelUsecase } from "../../../domain/interface/Vendor/IEdithotelusecase";
import { IgetHotelUsecase } from "../../../domain/interface/Vendor/IgetHotelUsevase";
import { ISearchHotelUsecase } from "../../../domain/interface/Vendor/IhotelSearchusecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class HotelController {
  constructor(
    private _createHotelUsecase: ICreateHotelUsecase,
    private _getHotelsUsecase: IgetHotelUsecase,
    private _editHotelUsecase: IEditHotelUsecase,
    private _deleteHotelUsecase: IDeleteHotelUsecase,
    private _searchHotelUsecase: ISearchHotelUsecase
  ) {}

  async createHotels(req: Request, res: Response) {
    try {
      const destinationId = req.params.id;
      const hotelData = req.body;

      const result = await this._createHotelUsecase.execute(
        hotelData,
        destinationId
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Hotel created successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getHotels(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this._getHotelsUsecase.execute(page, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Hotels fetched successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async editHotel(req: Request, res: Response) {
    try {
      const hotelId = req.params.id;
      const hotelData = req.body;

      const result = await this._editHotelUsecase.execute(hotelId, hotelData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Hotel updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async deleteHotel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this._deleteHotelUsecase.execute(id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Hotel deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async SearchHotel(req: Request, res: Response) {
    try {
      const query = req.query.q as string;

      const result = await this._searchHotelUsecase.execute(query);

      res.status(HttpStatus.OK).json({
        success: true,
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
