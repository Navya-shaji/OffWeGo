import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateDestinationUsecase } from "../../../domain/interface/Destination/ICreateDestinationUsecase";
import { IEditDestinationUseCase } from "../../../domain/interface/Destination/IEditDestination";
import { IGetAllDestinations } from "../../../domain/interface/Destination/IGetAllDestinations";
import { IgetDestinationUSecase } from "../../../domain/interface/Destination/IGetDestinationUsecase";
import { IDeleteDestinationUseCase } from "../../../domain/interface/Destination/IDeleteDestinationUsecase";
import { IsearchDestination } from "../../../domain/interface/Destination/IsearchDestinationusecase";

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
    const result = await this._createDestination.execute(req.body);
    res.status(HttpStatus.CREATED).json({ result });
  }

  async editDestinationHandler(req: Request, res: Response) {
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
  }

  async getAllDestination(req: Request, res: Response) {
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
  }

  async getSingleDestinationController(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this._destinationUsecase.execute(id);

    res.status(HttpStatus.OK).json(result);
  }

  async deleteDestinationController(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deleteDestinationusecase.execute(id);

    return res.status(HttpStatus.OK).json(result);
  }
  async searchDestination(req: Request, res: Response) {
    const query = req.query.q;

    if (typeof query !== "string" || !query.trim()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "The query will be string",
      });
      return;
    }
    const destinations = await this._serachDestinationusecase.execute(query);

    res.json({ success: true, data: destinations });
  }
}
