import { ICreatePackage } from "../../../domain/interface/vendor/IAddPackageUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { IEditPackageUsecase } from "../../../domain/interface/vendor/IPackageEditUsecase";
import { IDeletePackagenUseCase } from "../../../domain/interface/vendor/IPackageDeleteUsecase";
import { ISearchPackageUsecase } from "../../../domain/interface/vendor/IPackagesearchUsecase";
import { IGetAllPackageUsecase } from "../../../domain/interface/vendor/IGetAllPackageUsecase";

export class PackageController {
  constructor(
    private _getPackage: IGetAllPackageUsecase,
    private _createPackage: ICreatePackage,
    private _editpackage: IEditPackageUsecase,
    private _deletepackage: IDeletePackagenUseCase,
    private _searchPackage:ISearchPackageUsecase
  ) {}
  async getAllPackage(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this._getPackage.execute(page,limit);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to get Destinations" });
    }
  }

  async addPackage(req: Request, res: Response) {
    try {
      const packageData = req.body;
      console.log("packageData from the froentend",packageData)

      const destination = await DestinationModel.findById(
        packageData.destinationId
      );
      if (!destination) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Destination not found" });
      }
      packageData.destinationId = destination._id;

      let createdPackage = await this._createPackage.execute(packageData);
      res.status(HttpStatus.CREATED).json({ result: createdPackage });
      console.log("created packages",createdPackage)
     
    } catch (error) {
      console.error(error);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create package",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async EditPackage(req: Request, res: Response) {
    try {
      const packageId = req.params.id;
      const packageData = req.body;

      const result = await this._editpackage.execute(packageId, packageData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Package updation failed",
      });
    }
  }

  async deletePackage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._deletepackage.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Deleted package successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        messege: "Failed to delte package",
      });
    }
  }
    async searchPackage(req: Request, res: Response) {
    try {
      const query = req.query.q;

      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "The query will be string",
        });
        return;
      }
      const destinations = await this._searchPackage.execute(query);
      res.json({ success: true, data: destinations });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
