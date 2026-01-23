import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IBannerActionUsecase } from "../../../domain/interface/Banner/IBannerActionUsecase";
import { IBannerCreateUsecase } from "../../../domain/interface/Banner/IBannerCreateUsecase";
import { IEditBannerUsecase } from "../../../domain/interface/Banner/IBannerEditUsecase";
import { IDeleteBannerUsecase } from "../../../domain/interface/Banner/IDeleteBannerUSecase";
import { IGetBannerUsecase } from "../../../domain/interface/Banner/IGetAllBannnersUsecase";
import { success } from "../../../domain/constants/Success";
import { ErrorMessages } from "../../../domain/constants/Error";
import { AppError } from "../../../domain/errors/AppError";

export class BannerController {
  constructor(
    private _createBannerUsecase: IBannerCreateUsecase,
    private _getbannerUsecase: IGetBannerUsecase,
    private _editBannerUsecase: IEditBannerUsecase,
    private _deleteBannerUsecase: IDeleteBannerUsecase,
    private _updateActionUsecase: IBannerActionUsecase
  ) { }

  async createBanner(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._createBannerUsecase.execute(req.body);

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: success.SUCCESS_MESSAGES.CREATED,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getBanners(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._getbannerUsecase.execute();

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.FETCHED,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async editBanner(req: Request, res: Response): Promise<void> {
    try {
      const bannerId = req.params.bannerId?.trim();
      const bannerData = req.body;

      if (!bannerId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      const result = await this._editBannerUsecase.execute(
        bannerId,
        bannerData
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.UPDATED,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async bannerDelete(req: Request, res: Response): Promise<void> {
    try {
      const { bannerId } = req.params;

      if (!bannerId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.INVALID_ID,
        });
        return;
      }

      const result = await this._deleteBannerUsecase.execute(bannerId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.DELETED,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async bannerAction(req: Request, res: Response): Promise<void> {
    try {
      const { bannerId } = req.params;
      const { action } = req.body;

      if (!bannerId || !action) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ErrorMessages.MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      const updatedBanner = await this._updateActionUsecase.execute(bannerId, action);

      res.status(HttpStatus.OK).json({
        success: true,
        message: success.SUCCESS_MESSAGES.UPDATED,
        data: updatedBanner,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
