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
    private _createDestinationUsecase: ICreateDestinationUsecase,
    private _editDestinationUsecase: IEditDestinationUseCase,
    private _getAllDestinationsUsecase: IGetAllDestinations,
    private _getSingleDestinationUsecase: IgetDestinationUSecase,
    private _deleteDestinationUsecase: IDeleteDestinationUseCase,
    private _searchDestinationUsecase: IsearchDestination,
    private _getNearbyDestinationUsecase: IGetNearbyDestinationUsecase
  ) { }

  async addDestination(req: Request, res: Response) {
    try {
      const result = await this._createDestinationUsecase.execute(req.body);
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

      const result = await this._editDestinationUsecase.execute(
        destinationId,
        destinationData
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Destination updated successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("already exists") || errorMessage.includes("cannot be empty")) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, error: errorMessage });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to update destination",
          error: (error as Error).message,
        });
      }
    }
  }

  async getAllDestination(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { destinations, totalDestinations } =
        await this._getAllDestinationsUsecase.execute(page, limit);

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
      const result = await this._getSingleDestinationUsecase.execute(id);

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
      const result = await this._deleteDestinationUsecase.execute(id);

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

      const destinations = await this._searchDestinationUsecase.execute(query);

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

      const result = await this._getNearbyDestinationUsecase.execute(
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
