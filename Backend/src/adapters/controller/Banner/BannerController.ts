import { IBannerCreateUsecase } from "../../../domain/interface/Banner/IBannerCreateUsecase";
import { IEditBannerUsecase } from "../../../domain/interface/Banner/IBannerEditUsecase";
import { IDeleteBannerUsecase } from "../../../domain/interface/Banner/IDeleteBannerUSecase";
import { IGetBannerUsecase } from "../../../domain/interface/Banner/IGetAllBannnersUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";

export class Bannercontroller {
  constructor(
    private _createBanner: IBannerCreateUsecase,
    private _getbannerUsecase: IGetBannerUsecase,
    private _editBanner: IEditBannerUsecase,
    private _deleteBanner: IDeleteBannerUsecase
  ) {}

  async CreateBanner(req: Request, res: Response) {
    try {
      const result = await this._createBanner.execute(req.body);
      res.status(HttpStatus.OK).json({ result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to create banner" });
    }
  }

  async getBanners(req: Request, res: Response) {
    try {
      const result = await this._getbannerUsecase.execute();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to get the banner" });
    }
  }

  async EditBanner(req: Request, res: Response) {
    try {
      const BannerId = req.params.id;
      const BannerData = req.body;

      const result = await this._editBanner.execute(BannerId, BannerData);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Banner updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Banner updation failed",
      });
    }
  }

  async BannerDelete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = this._deleteBanner.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Banner deleted successsfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Banner deletion failed",
      });
    }
  }
}
