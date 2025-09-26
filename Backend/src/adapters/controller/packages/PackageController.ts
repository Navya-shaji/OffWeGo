import { Request, Response } from "express";
import { IGetPackageUsecase } from "../../../domain/interface/Vendor/IGetPackageUsecase";
import { ICreatePackage } from "../../../domain/interface/Vendor/IAddPackageUsecase";
import { IEditPackageUsecase } from "../../../domain/interface/Vendor/IPackageEditUsecase";
import { IDeletePackagenUseCase } from "../../../domain/interface/Vendor/IPackageDeleteUsecase";
import { ISearchPackageUsecase } from "../../../domain/interface/Vendor/IPackagesearchUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { IGetDestinationBasedPackage } from "../../../domain/interface/Vendor/IGetDestinationBasedPackage";

export class PackageController {
  constructor(
    private _getPackage: IGetPackageUsecase,
    private _createPackage: ICreatePackage,
    private _editpackage: IEditPackageUsecase,
    private _deletepackage: IDeletePackagenUseCase,
    private _searchPackage: ISearchPackageUsecase,
    private _getPackageByDestination:IGetDestinationBasedPackage
  ) {}
 
  async getAllPackage(req: Request, res: Response) {
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const vendorId = req.body.vendorId;

    if (!vendorId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Vendor not authenticated" });
    }

    const result = await this._getPackage.execute(vendorId, page, limit);
    res.status(HttpStatus.OK).json(result);
  }


  async getPackagesForUser(req: Request, res: Response) {
    const { id } = req.params;

   const destinationId=id
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!destinationId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Destination required" });
    }

    const result = await this._getPackageByDestination.execute(destinationId, page, limit);
   console.log(result,"hdg")
    res.status(HttpStatus.OK).json(result);
  }

 
  async addPackage(req: Request, res: Response) {
    try {
      const vendorId = req.body.vendorId;
      if (!vendorId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Vendor not authenticated" });
      }

      const packageData = req.body;
      const destination = await DestinationModel.findById(packageData.destinationId);
      if (!destination) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Destination not found" });
      }

      packageData.destinationId = destination._id;
      const createdPackage = await this._createPackage.execute(packageData, vendorId);

      res.status(HttpStatus.CREATED).json({ result: createdPackage });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to create package", err });
    }
  }

  async EditPackage(req: Request, res: Response) {
    const packageId = req.params.id;
    const packageData = req.body;
    const result = await this._editpackage.execute(packageId, packageData);

    res.status(HttpStatus.OK).json({ success: true, message: "Package updated successfully", data: result });
  }

  async deletePackage(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deletepackage.execute(id);
    res.status(HttpStatus.OK).json({ success: true, message: "Deleted package successfully", result });
  }

  async searchPackage(req: Request, res: Response) {
    const query = req.query.q;
    if (typeof query !== "string" || !query.trim()) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: "Query must be a string" });
      return;
    }
    const results = await this._searchPackage.execute(query);
    res.json({ success: true, data: results });
  }
}
