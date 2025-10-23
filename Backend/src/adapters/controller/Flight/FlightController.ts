import { ICreateFlightUsecase } from "../../../domain/interface/Flight/ICreateFlightUsecase";
import { IDeleteFlightUsecase } from "../../../domain/interface/Flight/IDeleteFlightUsecase";
import { IEditFlightUsecase } from "../../../domain/interface/Flight/IEditFlightUSecase";
import { IGetAllFlightUsecase } from "../../../domain/interface/Flight/IGetAllFlightUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class FlightController {
  constructor(
    private _createFlight: ICreateFlightUsecase,
    private _getFlight: IGetAllFlightUsecase,
    private _editFlight: IEditFlightUsecase,
    private _deleteFlight: IDeleteFlightUsecase
  ) {}

  async addFlightDetails(req: Request, res: Response) {
    const result = await this._createFlight.execute(req.body);
    res.status(HttpStatus.CREATED).json({ result });
  }
  async getAllFlight(req: Request, res: Response) {
    const result = await this._getFlight.execute();
    res.status(HttpStatus.OK).json({
      success: true,
      messege: result,
    });
  }
  async EditFlight(req: Request, res: Response) {
    const flightId = req.params.id;
    const flightData = req.body;
    const result = await this._editFlight.execute(flightId, flightData);
    res.status(HttpStatus.OK).json({
      success: true,
      messege: "Flight Details Updated",
      data: result,
    });
  }
  async DeleteFlight(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deleteFlight.execute(id);
    return res.status(HttpStatus.OK).json({ result });
  }
}
