import { IBannerActionUsecase } from "../../../domain/interface/Banner/IBannerActionUsecase";
import { IBannerCreateUsecase } from "../../../domain/interface/Banner/IBannerCreateUsecase";
import { IEditBannerUsecase } from "../../../domain/interface/Banner/IBannerEditUsecase";
import { IDeleteBannerUsecase } from "../../../domain/interface/Banner/IDeleteBannerUSecase";
import { IGetBannerUsecase } from "../../../domain/interface/Banner/IGetAllBannnersUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class Bannercontroller {
  constructor(
    private _createBanner: IBannerCreateUsecase,
    private _getbannerUsecase: IGetBannerUsecase,
    private _editBanner: IEditBannerUsecase,
    private _deleteBanner: IDeleteBannerUsecase,
    private _updateAction: IBannerActionUsecase
  ) {}

  async createBanner(req: Request, res: Response) {
    const result = await this._createBanner.execute(req.body);
    res.status(HttpStatus.OK).json({ result });
  }

  async getBanners(req: Request, res: Response) {
    const result = await this._getbannerUsecase.execute();
    res.status(HttpStatus.OK).json(result);
  }

  async editBanner(req: Request, res: Response) {
    const BannerId = req.params.id;
    const BannerData = req.body;
    const result = await this._editBanner.execute(BannerId, BannerData);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Banner updated successfully",
      data: result,
    });
  }

  async bannerDelete(req: Request, res: Response) {
    const { id } = req.params;
    const result = this._deleteBanner.execute(id);
    res.status(HttpStatus.OK).json({
      success: true,
      message: "Banner deleted successsfully",
      result,
    });
  }

  async bannerAction(req: Request, res: Response) {
    const { id } = req.params;
    const { action } = req.body;
    if (typeof action !== "boolean") {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Action must be a boolean" });
    }
    const updatedBanner = await this._updateAction.execute(id, action);
    if (!updatedBanner) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Banner not found" });
    }
    res.status(HttpStatus.OK).json(updatedBanner);
  }
}
