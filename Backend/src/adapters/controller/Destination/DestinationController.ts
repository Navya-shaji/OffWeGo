import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { ICreateDestinationUsecase } from "../../../domain/interface/destination/ICreateDestinationUsecase";
import { IEditDestinationUseCase } from "../../../domain/interface/destination/IEditDestination";
import { IGetAllDestinations } from "../../../domain/interface/destination/IGetAllDestinations";
import { IgetDestinationUSecase } from "../../../domain/interface/destination/IGetDestinationUsecase";
import { IDeleteDestinationUseCase } from "../../../domain/interface/destination/IDeleteDestinationUsecase";

export class DestinationController {
  constructor(
    private createDestination: ICreateDestinationUsecase,
    private editDestination: IEditDestinationUseCase,
    private getDestination: IGetAllDestinations,
    private destinationUsecase: IgetDestinationUSecase,
    private deleteDestinationusecase:IDeleteDestinationUseCase
  ) {}
  async addDestination(req: Request, res: Response) {
    try {
      const result = await this.createDestination.execute(req.body);
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

      const result = await this.editDestination.execute(
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
      const result = await this.getDestination.execute();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get Destinations" });
    }
  }
  async getSingleDestinationController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(req.params);
      const result = await this.destinationUsecase.execute(id);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get Destinations" });
    }
  }
  async deleteDestinationController(req:Request,res:Response){
    try {
      const { id } = req.params;
const result = await this.deleteDestinationusecase.execute(id);


      return res.status(HttpStatus.OK).json(result)

    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Failed to delete Destination"})
    }
  }
}
