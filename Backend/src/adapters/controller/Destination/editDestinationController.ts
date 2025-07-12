import { EditDestination } from "../../../useCases/Destination/editDestinationUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class EditDestinationController {
  constructor(private editDestination: EditDestination) {}

  async editDestinationHandler(req: Request, res: Response) {
    try {
      const destinationId = req.params.id;
      const destinationData = req.body;

      const result = await this.editDestination.execute(destinationId, destinationData);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Destination updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("EditDestination error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update destination",
      });
    }
  }
}
