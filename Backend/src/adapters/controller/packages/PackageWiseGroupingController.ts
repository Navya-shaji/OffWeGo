import { ICreateGroupUseCase } from "../../../domain/interface/Vendor/IPackageWiseGroupUsecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IGetPackageWiseGroupUsecase } from "../../../domain/interface/Vendor/IGetPackageWiseGroupsUsecase";

export class PackageWiseGroupingController {
  constructor(
    private _createGroupUsecase: ICreateGroupUseCase,
    private _getgroupsusecase: IGetPackageWiseGroupUsecase
  ) {}

  async CreatePackageWiseGrouping(req: Request, res: Response) {
    try {
      const groupData = req.body;
      const result = await this._createGroupUsecase.execute(groupData);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package wise group created",
        data: result,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message || "Failed to create group",
      });
    }
  }

  async GetPackageWiseGroups(req: Request, res: Response) {
    try {
      const packageId = req.params.id;
      if (!packageId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Package ID is required",
        });
      }

      const result = await this._getgroupsusecase.execute(packageId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package wise group fetched successfully",
        data: result,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message || "Failed to fetch groups",
      });
    }
  }
}
