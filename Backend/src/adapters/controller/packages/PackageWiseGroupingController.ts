import { ICreateGroupUseCase } from "../../../domain/interface/vendor/IPackageWiseGroupUsecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { IGetPackageWiseGroupUsecase } from "../../../domain/interface/vendor/IGetPackageWiseGroupsUsecase";

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
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Package wise group creation failed",
      });
    }
  }

  async GetPackageWiseGroups(req: Request, res: Response) {
    try {
      const packageId = req.params.id;
      const result = await this._getgroupsusecase.execute(packageId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package wise group fetched successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Package wise group fetching failed",
      });
    }
  }
}
