import { Request, Response } from "express";
import { ICreatePackage } from "../../../domain/interface/Vendor/IAddPackageUsecase";
import { IEditPackageUsecase } from "../../../domain/interface/Vendor/IPackageEditUsecase";
import { IDeletePackagenUseCase } from "../../../domain/interface/Vendor/IPackageDeleteUsecase";
import { ISearchPackageUsecase } from "../../../domain/interface/Vendor/IPackagesearchUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { IGetDestinationBasedPackage } from "../../../domain/interface/Vendor/IGetDestinationBasedPackage";
import { IGetPackagesUsecase } from "../../../domain/interface/Vendor/IGetAllPackageUsecase";
import { Hotel } from "../../../domain/entities/HotelEntity";

export class PackageController {
  constructor(
    private _getPackage: IGetPackagesUsecase,
    private _createPackage: ICreatePackage,
    private _editpackage: IEditPackageUsecase,
    private _deletepackage: IDeletePackagenUseCase,
    private _searchPackage: ISearchPackageUsecase,
    private _getPackageByDestination: IGetDestinationBasedPackage
  ) {}

  async getAllPackage(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const vendorId = req.body.vendorId;
    if (!vendorId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Vendor not authenticated" });
    }
    const result = await this._getPackage.execute({
      vendorId,
      limit,
      page,
      role: "vendor",
    });
    res.status(HttpStatus.OK).json({
      success: true,
      packages: result.packages,
      totalPackages: result.totalPackages,
    });
  }

  async getPackagesForUser(req: Request, res: Response) {
    const destinationId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    if (!destinationId) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Destination required" });
    }
    const skip = (page - 1) * limit;
    const result = await this._getPackageByDestination.execute(
      destinationId,
      skip,
      limit
    );
    res.status(HttpStatus.OK).json({
      success: true,
      packages: result.packages,
      totalPackages: result.totalPackages,
      currentPage: page,
      totalPages: Math.ceil(result.totalPackages / limit),
    });
  }

  async addPackage(req: Request, res: Response) {
    try {
      const vendorId = req.body.vendorId;
      if (!vendorId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: "Vendor not authenticated" });
      }

      const packageData = req.body;

      const destination = await DestinationModel.findById(
        packageData.destinationId
      );
      if (!destination) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Destination not found" });
      }

      packageData.destinationId = destination._id;

      packageData.hotels =
        packageData.hotels?.map((hotel: Hotel) => hotel.hotelId) || [];
      packageData.activities =
        packageData.activities?.map((act:any) => act.activityId || act?.id) || [];

      const createdPackage = await this._createPackage.execute(
        packageData,
        vendorId
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        packages: [createdPackage],
        totalPackages: 1,
      });
    } catch (err) {
      console.error(" Error creating package:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create package",
      });
    }
  }

  async EditPackage(req: Request, res: Response) {
    const packageId = req.params.id;
    const packageData = req.body;
    const result = await this._editpackage.execute(packageId, packageData);
    res
      .status(HttpStatus.OK)
      .json({ success: true, packages: [result], totalPackages: 1 });
  }

  async deletePackage(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deletepackage.execute(id);
    res
      .status(HttpStatus.OK)
      .json({ success: true, packages: [result], totalPackages: 1 });
  }

  async searchPackage(req: Request, res: Response) {
    const query = req.query.q;
    if (typeof query !== "string" || !query.trim()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Query must be a string" });
    }
    const results = await this._searchPackage.execute(query);
    res.status(HttpStatus.OK).json({
      success: true,
      packages: results,
      totalPackages: results.length,
    });
  }
}
