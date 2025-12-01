import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateDestinationUsecase } from "../../../domain/interface/Destination/ICreateDestinationUsecase";
import { IEditDestinationUseCase } from "../../../domain/interface/Destination/IEditDestination";
import { IGetAllDestinations } from "../../../domain/interface/Destination/IGetAllDestinations";
import { IgetDestinationUSecase } from "../../../domain/interface/Destination/IGetDestinationUsecase";
import { IDeleteDestinationUseCase } from "../../../domain/interface/Destination/IDeleteDestinationUsecase";
import { IsearchDestination } from "../../../domain/interface/Destination/IsearchDestinationusecase";
import { IGetNearbyDestinationUsecase } from "../../../domain/interface/Destination/IGetNearByDestinationUSecase";

export class DestinationController {
  constructor(
    private _createDestination: ICreateDestinationUsecase,
    private _editDestination: IEditDestinationUseCase,
    private _getDestination: IGetAllDestinations,
    private _destinationUsecase: IgetDestinationUSecase,
    private _deleteDestinationusecase: IDeleteDestinationUseCase,
    private _serachDestinationusecase: IsearchDestination,
    private _getNearByDestinationusecase: IGetNearbyDestinationUsecase
  ) {}

  async addDestination(req: Request, res: Response) {
    try {
      const result = await this._createDestination.execute(req.body);
      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create destination",
        error: (error as Error).message,
      });
    }
  }

  async editDestinationHandler(req: Request, res: Response) {
    try {
      const destinationId = req.params.id;
      const destinationData = req.body;
      const result = await this._editDestination.execute(
        destinationId,
        destinationData
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Destination updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update destination",
        error: (error as Error).message,
      });
    }
  }

  async getAllDestination(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const { destinations, totalDestinations } =
        await this._getDestination.execute(page, limit);
      res.status(HttpStatus.OK).json({
        success: true,
        destinations,
        totalDestinations,
        currentPage: page,
        totalPages: Math.ceil(totalDestinations / limit),
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch destinations",
        error: (error as Error).message,
      });
    }
  }

  async getSingleDestinationController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._destinationUsecase.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch destination",
        error: (error as Error).message,
      });
    }
  }

  async deleteDestinationController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._deleteDestinationusecase.execute(id);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete destination",
        error: (error as Error).message,
      });
    }
  }

  async searchDestination(req: Request, res: Response) {
    try {
      const query = req.query.q;
      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "The query must be a non-empty string",
        });
        return;
      }
      const destinations = await this._serachDestinationusecase.execute(query);
      res.status(HttpStatus.OK).json({ success: true, data: destinations });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search destinations",
        error: (error as Error).message,
      });
    }
  }

  async getNearByDestination(req: Request, res: Response) {
    try {
      const { lat, lng, radiusInKm } = req.body;
      const result = await this._getNearByDestinationusecase.execute(
        lat,
        lng,
        radiusInKm
      );
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to get nearby destinations",
        error: (error as Error).message,
      });
    }
  }
}
