import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { ICreateDestinationUsecase } from "../../../domain/interface/destination/ICreateDestinationUsecase";
import { IEditDestinationUseCase } from "../../../domain/interface/destination/IEditDestination";
import { IGetAllDestinations } from "../../../domain/interface/destination/IGetAllDestinations";
import { IgetDestinationUSecase } from "../../../domain/interface/destination/IGetDestinationUsecase";
import { IDeleteDestinationUseCase } from "../../../domain/interface/destination/IDeleteDestinationUsecase";
import { IsearchDestination } from "../../../domain/interface/destination/IsearchDestinationusecase";

export class DestinationController {
  constructor(
    private _createDestination: ICreateDestinationUsecase,
    private _editDestination: IEditDestinationUseCase,
    private _getDestination: IGetAllDestinations,
    private _destinationUsecase: IgetDestinationUSecase,
    private _deleteDestinationusecase: IDeleteDestinationUseCase,
    private _serachDestinationusecase: IsearchDestination
  ) {}

  async addDestination(req: Request, res: Response) {
    try {
      const result = await this._createDestination.execute(req.body);
      res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to create Destinations" });
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

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Destination updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update destination",
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
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get Destinations" });
    }
  }

  async getSingleDestinationController(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this._destinationUsecase.execute(id);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get Destinations" });
    }
  }

  async deleteDestinationController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._deleteDestinationusecase.execute(id);

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to delete Destination" });
    }
  }
  async searchDestination(req: Request, res: Response) {
    try {
      const query = req.query.q;

      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "The query will be string",
        });
        return;
      }
      const destinations = await this._serachDestinationusecase.execute(query);
      res.json({ success: true, data: destinations });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
