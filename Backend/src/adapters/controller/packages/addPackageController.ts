import { Request, Response } from "express";
import { ICreatePackage } from "../../../domain/interface/vendor/IAddPackageUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
export class CreatePackagecontroller {
  constructor(private createPackage: ICreatePackage) {}

  async addPackage(req: Request, res: Response) {
    try {
      const result = await this.createPackage.execute(req.body);
      res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to create Destinations" });
    }
  }
}
