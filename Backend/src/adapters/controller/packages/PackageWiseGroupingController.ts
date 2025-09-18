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
    
      const groupData = req.body;
      const result = await this._createGroupUsecase.execute(groupData);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package wise group created",
        data: result,
      });
    
  }

  async GetPackageWiseGroups(req: Request, res: Response) {
    
      const packageId = req.params.id;
      const result = await this._getgroupsusecase.execute(packageId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Package wise group fetched successfully",
        data: result,
      });
    
  }
}
