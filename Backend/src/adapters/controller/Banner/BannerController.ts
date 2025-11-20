import { IBannerActionUsecase } from "../../../domain/interface/Banner/IBannerActionUsecase";
import { IBannerCreateUsecase } from "../../../domain/interface/Banner/IBannerCreateUsecase";
import { IEditBannerUsecase } from "../../../domain/interface/Banner/IBannerEditUsecase";
import { IDeleteBannerUsecase } from "../../../domain/interface/Banner/IDeleteBannerUSecase";
import { IGetBannerUsecase } from "../../../domain/interface/Banner/IGetAllBannnersUsecase";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { Request, Response } from "express";

export class BannerController {
  constructor(
    private _createBanner: IBannerCreateUsecase,
    private _getbannerUsecase: IGetBannerUsecase,
    private _editBanner: IEditBannerUsecase,
    private _deleteBanner: IDeleteBannerUsecase,
    private _updateAction: IBannerActionUsecase
  ) {}

  async createBanner(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._createBanner.execute(req.body);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create banner",
        error,
      });
    }
  }

  async getBanners(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._getbannerUsecase.execute();
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch banners",
        error,
      });
    }
  }

  async editBanner(req: Request, res: Response): Promise<void> {
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
        message: "Failed to update banner",
        error,
      });
    }
  }

  async bannerDelete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this._deleteBanner.execute(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Banner deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete banner",
        error,
      });
    }
  }

  async bannerAction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action } = req.body;
      if (typeof action !== "boolean") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Action must be a boolean",
        });
        return;
      }

      const updatedBanner = await this._updateAction.execute(id, action);
      if (!updatedBanner) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Banner not found",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Banner action updated successfully",
        data: updatedBanner,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update banner action",
        error,
      });
    }
  }
}
