
import { Request, Response } from "express";
import { ICreatePackage } from "../../../domain/interface/vendor/IAddPackageUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";

export class CreatePackagecontroller {
  constructor(private createPackage: ICreatePackage) {}

  async addPackage(req: Request, res: Response) {
    try {
      const packageData = req.body;
      console.log("Package Data:", packageData);

      // Validate ObjectId is actually an id, not a name
      const destination = await DestinationModel.findById(packageData.destinationId);

      if (!destination) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Destination not found",
        });
      }

      packageData.destination = destination._id;

      const result = await this.createPackage.execute(packageData);
      console.log("Created Package:", result);

      res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create package",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
