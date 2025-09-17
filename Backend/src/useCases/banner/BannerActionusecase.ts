import { IBannerActionUsecase } from "../../domain/interface/Banner/IBannerActionUsecase";
import { IBannerRepository } from "../../domain/interface/Banner/IBannerRepository";
import { IBannerModel } from "../../framework/database/Models/bannerModel";

export class BannerActionUsecase implements IBannerActionUsecase {
  constructor(private _bannerRepository: IBannerRepository) {}

  async execute(id: string, action: boolean): Promise<IBannerModel | null> {
    return this._bannerRepository.updateBannerStatus(id, action);
  }
}
