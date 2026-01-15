import { Request, Response } from "express";
import { ICreatePackage } from "../../../domain/interface/Vendor/IAddPackageUsecase";
import { IEditPackageUsecase } from "../../../domain/interface/Vendor/IPackageEditUsecase";
import { IDeletePackagenUseCase } from "../../../domain/interface/Vendor/IPackageDeleteUsecase";
import { ISearchPackageUsecase } from "../../../domain/interface/Vendor/IPackagesearchUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { IGetDestinationBasedPackage } from "../../../domain/interface/Vendor/IGetDestinationBasedPackage";
import { IGetPackagesUsecase } from "../../../domain/interface/Vendor/IGetAllPackageUsecase";
import { Role } from "../../../domain/constants/Roles";

export class PackageController {
  constructor(
    private _getPackagesUsecase: IGetPackagesUsecase,
    private _createPackageUsecase: ICreatePackage,
    private _editPackageUsecase: IEditPackageUsecase,
    private _deletePackageUsecase: IDeletePackagenUseCase,
    private _searchPackageUsecase: ISearchPackageUsecase,
    private _getPackageByDestinationUsecase: IGetDestinationBasedPackage
  ) {}

  async getAllPackage(req: Request, res: Response) {
    try {
      const page = parseInt(req.body.params?.page) || 1;
      const limit = parseInt(req.body.params?.limit) || 3;
      const vendorId = req.body.vendorId;

      const result = await this._getPackagesUsecase.execute({
        vendorId,
        limit,
        page,
        role: Role.VENDOR,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        packages: result.packages,
        totalPackages: result.totalPackages,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }

  async getPackagesForUser(req: Request, res: Response) {
    try {
      const destinationId = req.params.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;

      if (!destinationId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Destination required" });
      }

      const skip = (page - 1) * limit;

      const result = await this._getPackageByDestinationUsecase.execute(
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
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }

  async addPackage(req: Request, res: Response) {
    try {
      // Extract vendorId from JWT token for security
      const vendorId = req.user?.id;
      
      if (!vendorId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in token",
        });
      }

      const packageData = req.body;

      if (!packageData.destinationId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Destination ID is required",
        });
      }

      const destination = await DestinationModel.findById(
        packageData.destinationId
      );
      if (!destination) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Destination not found" });
      }

      packageData.destinationId = destination._id;

      const createdPackage = await this._createPackageUsecase.execute(
        packageData,
        vendorId
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        packages: [createdPackage],
        totalPackages: 1,
      });
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || "Failed to create package";
      
      // Check if error is related to subscription
      const isSubscriptionError = 
        errorMessage.includes("subscription") || 
        errorMessage.includes("active subscription") ||
        errorMessage.includes("expired") ||
        errorMessage.includes("not active");

      const statusCode = isSubscriptionError 
        ? HttpStatus.FORBIDDEN 
        : HttpStatus.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }
  }

  async EditPackage(req: Request, res: Response) {
    try {
      const packageId = req.params.id;
      const packageData = req.body;

      const result = await this._editPackageUsecase.execute(
        packageId,
        packageData
      );

      res.status(HttpStatus.OK).json({
        success: true,
        packages: [result],
        totalPackages: 1,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }

  async deletePackage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this._deletePackageUsecase.execute(id);

      res.status(HttpStatus.OK).json({
        success: true,
        packages: [result],
        totalPackages: 1,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }

  async searchPackage(req: Request, res: Response) {
    try {
      const query = req.query.q;

      if (typeof query !== "string" || !query.trim()) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Query must be a string" });
      }

      const results = await this._searchPackageUsecase.execute(query);

      res.status(HttpStatus.OK).json({
        success: true,
        packages: results,
        totalPackages: results.length,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
}
