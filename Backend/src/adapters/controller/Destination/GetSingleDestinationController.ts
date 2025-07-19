import { IgetDestinationUSecase } from "../../../domain/interface/destination/IGetDestinationUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request,Response } from "express";
export class GetSingleDestinationController {
  constructor(private destinationUsecase: IgetDestinationUSecase) {}

  async getSingleDestinationController(req: Request, res: Response) {
    try {
    const { id } = req.params; 
    console.log(req.params)
      const result = await this.destinationUsecase.execute(id);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get Destinations" });
    }
  }
}
