import { IBannerCreateUsecase } from "../../../domain/interface/Banner/IBannerCreateUsecase";
import { IGetBannerUsecase } from "../../../domain/interface/Banner/IGetAllBannnersUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request, Response } from "express";
export class Bannercontroller {
  constructor(
    private createBanner: IBannerCreateUsecase,
    private getbannerUsecase: IGetBannerUsecase
  ) {}

  async CreateBanner(req: Request, res: Response) {
    try {
      const result = await this.createBanner.execute(req.body);
      res.status(HttpStatus.OK).json({ result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to create banner" });
    }
  }

  async getBanners(req: Request, res: Response) {
    try {
      const result = await this.getbannerUsecase.execute();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to get the banner" });
    }
  }
}
