import { ICreateFlightUsecase } from "../../../domain/interface/Flight/ICreateFlightUsecase";
import { IDeleteFlightUsecase } from "../../../domain/interface/Flight/IDeleteFlightUsecase";
import { IEditFlightUsecase } from "../../../domain/interface/Flight/IEditFlightUSecase";
import { IGetAllFlightUsecase } from "../../../domain/interface/Flight/IGetAllFlightUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class FlightController {
  constructor(
    private _createFlightUsecase: ICreateFlightUsecase,
    private _getAllFlightUsecase: IGetAllFlightUsecase,
    private _editFlightUsecase: IEditFlightUsecase,
    private _deleteFlightUsecase: IDeleteFlightUsecase
  ) {}

  async addFlightDetails(req: Request, res: Response) {
    try {
      const result = await this._createFlightUsecase.execute(req.body);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to add flight",
        error: (error as Error).message,
      });
    }
  }

  async getAllFlight(req: Request, res: Response) {
    try {
      const result = await this._getAllFlightUsecase.execute();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch flights",
        error: (error as Error).message,
      });
    }
  }

  async EditFlight(req: Request, res: Response) {
    try {
      const flightId = req.params.id;
      const flightData = req.body;
      const result = await this._editFlightUsecase.execute(flightId, flightData);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Flight details updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update flight",
        error: (error as Error).message,
      });
    }
  }

  async DeleteFlight(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._deleteFlightUsecase.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete flight",
        error: (error as Error).message,
      });
    }
  }
}
