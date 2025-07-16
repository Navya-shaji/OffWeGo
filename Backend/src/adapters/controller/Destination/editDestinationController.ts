import { IEditDestinationUseCase } from "../../../domain/interface/destination/IEditDestination";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class EditDestinationController {
  constructor(private editDestination: IEditDestinationUseCase) {}

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
}
