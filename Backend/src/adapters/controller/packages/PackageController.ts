import { ICreatePackage } from "../../../domain/interface/Vendor/IAddPackageUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { IEditPackageUsecase } from "../../../domain/interface/Vendor/IPackageEditUsecase";
import { IDeletePackagenUseCase } from "../../../domain/interface/Vendor/IPackageDeleteUsecase";
import { ISearchPackageUsecase } from "../../../domain/interface/Vendor/IPackagesearchUsecase";
import { IGetAllPackageUsecase } from "../../../domain/interface/Vendor/IGetAllPackageUsecase";

export class PackageController {
  constructor(
    private _getPackage: IGetAllPackageUsecase,
    private _createPackage: ICreatePackage,
    private _editpackage: IEditPackageUsecase,
    private _deletepackage: IDeletePackagenUseCase,
    private _searchPackage: ISearchPackageUsecase
  ) {}
  async getAllPackage(req: Request, res: Response) {
   
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this._getPackage.execute(page, limit);

      res.status(HttpStatus.OK).json(result);
      console.log("Backend data",result)
   
  }

  async addPackage(req: Request, res: Response) {
   
      const packageData = req.body;
      console.log("packageData",packageData)

      const destination = await DestinationModel.findById(
        packageData.destinationId
      );

      if (!destination) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Destination not found" });
      }
      packageData.destinationId = destination._id;

      const createdPackage = await this._createPackage.execute(packageData);
      res.status(HttpStatus.CREATED).json({ result: createdPackage });
   
  }

  async EditPackage(req: Request, res: Response) {
   
      const packageId = req.params.id;
      const packageData = req.body;

      const result = await this._editpackage.execute(packageId, packageData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package updated successfully",
        data: result,
      });
    
  }

  async deletePackage(req: Request, res: Response) {
    
      const { id } = req.params;
      const result = await this._deletepackage.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Deleted package successfully",
        result
      });
   
  }
  async searchPackage(req: Request, res: Response) {
   
      const query = req.query.q;

      if (typeof query !== "string" || !query.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "The query will be string",
        });
        return;
      }
      const destinations = await this._searchPackage.execute(query);
      res.json({ success: true, data: destinations });
   
  }
}
